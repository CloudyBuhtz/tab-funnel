import { removeTabs, storeTabs, type TabV2, type UUID } from "./data";

export type SyncOp = AddOp | RemOp;

type BaseOp = {
  id: UUID;
};

export type AddOp = BaseOp & {
  kind: "add";
  tab: TabV2;
};

export type RemOp = BaseOp & {
  kind: "rem";
  hash: UUID;
};

export const executeOp = async (op: SyncOp): Promise<void> => {
  switch (op.kind) {
    case "add":
      // console.log("Adding Tab", op.tab);
      await storeTabs([op.tab], { tabSyncEnabled: false });
      return;
    case "rem":
      // console.log("Removing Tab", op.hash);
      try {
        await removeTabs([{ hash: op.hash } as TabV2], { tabSyncEnabled: false });
      } catch {
        // console.warn("Oops");
      }
      return;
  }
};
