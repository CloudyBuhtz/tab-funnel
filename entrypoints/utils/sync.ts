import { removeTabs, storeTabs, type TabV2, type UUID } from "./data";
import { Options } from "./options.ts";
import { CompleteOpsItem } from "./storage.ts";

export type SyncOp = AddOp | RemOp | ConOp;

type BaseOp = {
  id: UUID;
};

export type AddOp = BaseOp & {
  kind: "add";
  tab: TabV2;
};

export type RemOp = BaseOp & {
  kind: "rem";
  hash: UUID; // Tab Hash
};

export type ConOp = BaseOp & {
  kind: "con";
  hash: UUID; // Op Hash
};

export const syncAddOp = async (t: TabV2[]): Promise<void> => {
  const tabSyncUUID = await Options.TAB_SYNC_UUID.item.getValue();
  const addOps: AddOp[] = t.map(t => {
    return {
      kind: "add",
      id: crypto.randomUUID(),
      tab: t
    } satisfies AddOp;
  });
  const currentOps: SyncOp[] = await storage.getItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, { fallback: [] });
  await storage.setItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, [...currentOps, ...addOps]);
};

export const syncRemOp = async (t: TabV2[]): Promise<void> => {
  const tabSyncUUID = await Options.TAB_SYNC_UUID.item.getValue();
  const remOps: RemOp[] = t.map(t => {
    return {
      kind: "rem",
      id: crypto.randomUUID(),
      hash: t.hash
    } satisfies RemOp;
  });
  const currentOps: SyncOp[] = await storage.getItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, { fallback: [] });
  await storage.setItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, [...currentOps, ...remOps]);
};

export const syncConOp = async (o: SyncOp[]): Promise<void> => {
  const tabSyncUUID = await Options.TAB_SYNC_UUID.item.getValue();
  const conOps: ConOp[] = o.filter(o => o.kind !== "con").map(o => {
    return {
      kind: "con",
      id: crypto.randomUUID(),
      hash: o.id
    } satisfies ConOp;
  });

  console.log(o.length, conOps);
  const currentOps: SyncOp[] = await storage.getItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, { fallback: [] });
  await storage.setItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, [...currentOps, ...conOps]);
};

export const copySyncOp = async (): Promise<void> => {
  // Should be non-destructive
  const tabSyncUUID = await Options.TAB_SYNC_UUID.item.getValue();
  const localOps = (await storage.getItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, { fallback: [] }))
    .sort((a, b) => {
      if (a.kind === "con" && b.kind !== "con") return -1;
      if (a.kind !== "con" && b.kind === "con") return 1;
      return 0;
    });

  const getSize = (v: any[]) => (new Blob([JSON.stringify(v)]).size);

  let localSlice = localOps.slice(0);
  let i = localSlice.length;
  let localSize = getSize(localSlice);
  while (localSize > 8000) {
    i--;
    localSlice = localOps.slice(0, i);
    localSize = getSize(localSlice);
  }

  console.log("Safe LocalOps: ", localSlice, localSize);

  await storage.setItem<SyncOp[]>(`sync:sync_op-${tabSyncUUID}`, localSlice).catch(e => {
    console.warn("Problem moving to Firefox Sync: ", e);
    browser.alarms.create("sync-copy-alarm", {
      delayInMinutes: 1
    });
  });
};

export const executeOp = async (op: SyncOp): Promise<void> => {
  switch (op.kind) {
    case "add":
      console.log("Adding Tab", op.tab);
      await storeTabs([{ ...op.tab, new: true }], { tabSyncEnabled: false });
      return;

    case "rem":
      console.log("Removing Tab", op.hash);
      await removeTabs([{ hash: op.hash } as TabV2], { tabSyncEnabled: false }).catch(e => {
        console.warn("Error removing Tab: ", e);
      });
      return;

    case "con":
      console.log("Reading Confirm", op.hash);
      const tabSyncUUID = await Options.TAB_SYNC_UUID.item.getValue();
      const localOps = await storage.getItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, { fallback: [] });

      // Check if it came from us
      if (localOps.find(l => { return l.id === op.hash; })) {
        let completeOps = await CompleteOpsItem.getValue();
        const instanceCount = (await Options.TAB_SYNC_INSTANCES.item.getValue()).length - 1;

        const count = completeOps.get(op.hash) ?? 0;
        if (count + 1 === instanceCount) {
          completeOps.delete(op.hash);
          await storage.setItem<SyncOp[]>(`local:sync_op-${tabSyncUUID}`, localOps.filter(v => { v.id !== op.hash; }));
        } else {
          completeOps.set(op.hash, count + 1);
        }
      }
      return;
  }
};
