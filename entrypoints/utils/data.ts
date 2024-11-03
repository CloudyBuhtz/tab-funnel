import { AddOp, copySyncOp, RemOp, syncAddOp, SyncOp, syncRemOp } from './sync';
import { Tabs } from 'wxt/browser';
import { Options } from './options';
import {
  TabItem,
  TabCountItem,
  LastSnapshotDateItem,
  LastSnapshotHashItem,
} from "../utils/storage";
import { hashString } from "./misc";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type Tab = {
  title: string;
  url: string;
  date: string;
  hash: UUID;
  pinned?: boolean;
};
export type TabV2 = {
  title: string;
  url: string;
  date: string;
  hash: UUID;
  pinned: boolean;
  new?: boolean;
};

export const funnelTabs = async (tabs: Tabs.Tab[], overrides?: {
  funnelPinnedTabs?: boolean;
  ignoreDuplicateTabs?: boolean;
  removeTabsFunnelled?: boolean;
}): Promise<void> => {
  const funnelPinnedTabs = overrides?.funnelPinnedTabs ?? await Options.FUNNEL_PINNED_TABS.item.getValue();
  const ignoreDuplicateTabs = overrides?.ignoreDuplicateTabs ?? await Options.IGNORE_DUPLICATE_TABS.item.getValue();
  const removeTabsFunnelled = overrides?.removeTabsFunnelled ?? await Options.REMOVE_TABS_FUNNELLED.item.getValue();

  const now = Date.now().toString();
  const storedTabs = await TabItem.getValue();

  const hasTab = (url: string): boolean => {
    return (storedTabs.find(v => {
      return v.url === url;
    })) ? true : false;
  };

  let newTabs = tabs.map((t) => {
    return {
      title: t.title!,
      url: t.url!,
      date: now,
      hash: crypto.randomUUID(),
      pinned: t.pinned,
    } satisfies TabV2;
  });

  if (!funnelPinnedTabs) {
    newTabs = newTabs.filter(t => {
      return !t.pinned;
    });
  }

  if (ignoreDuplicateTabs) {
    newTabs = newTabs.filter(t => {
      return !hasTab(t.url);
    });
  }

  await storeTabs(newTabs);

  if (removeTabsFunnelled) {
    browser.tabs.remove(tabs.filter(t => { return !(!funnelPinnedTabs && t.pinned); }).map(t => { return t.id!; }));
  }
};

export const storeTabs = async (newTabs: TabV2[], overrides?: {
  tabSyncEnabled?: boolean;
}): Promise<void> => {
  const currentTabs = await TabItem.getValue();
  const tabCount = await TabCountItem.getValue();
  await TabItem.setValue([...currentTabs, ...newTabs]);
  await TabCountItem.setValue(tabCount + newTabs.length);

  // Tab Sync
  const tabSyncEnabled = overrides?.tabSyncEnabled ?? await Options.TAB_SYNC_ENABLED.item.getValue();
  if (tabSyncEnabled) {
    console.log(`Adding ${newTabs.length} Tabs`);
    await syncAddOp(newTabs);
    await copySyncOp();
  }

  // Snapshot Tabs
  const snapshotFrequency = await Options.SNAPSHOT_FREQUENCY.item.getValue();
  if (snapshotFrequency === "only_funnel" || snapshotFrequency === "every_change") {
    await snapshotTabs();
  }
};

export const removeTabs = async (remTabs: TabV2[], overrides?: {
  tabSyncEnabled?: boolean;
}): Promise<void> => {
  const tabs = await TabItem.getValue();
  const filteredTabs = tabs.filter((t: Tab) => {
    return !(remTabs.filter((v) => v.hash === t.hash).length > 0);
  });
  await TabItem.setValue(filteredTabs);

  await TabCountItem.setValue(filteredTabs.length);

  // Tab Sync
  const tabSyncEnabled = overrides?.tabSyncEnabled ?? await Options.TAB_SYNC_ENABLED.item.getValue();
  if (tabSyncEnabled) {
    console.log(`Removing ${remTabs.length} Tabs`);
    await syncRemOp(remTabs);
    await copySyncOp();
  }

  // Snapshot Tabs
  const snapshotFrequency = await Options.SNAPSHOT_FREQUENCY.item.getValue();
  if (snapshotFrequency === "every_change") {
    await snapshotTabs();
  }
};

export const replaceTabs = async (repTabs: TabV2[]): Promise<void> => {
  const tabs = await TabItem.getValue();
  const filteredTabs = tabs.filter((t: Tab) => {
    return !(repTabs.filter((v) => v.hash === t.hash).length > 0);
  });

  const newTabs = [...filteredTabs, ...repTabs];
  await TabItem.setValue(newTabs);

  await TabCountItem.setValue(newTabs.length);
};

export const snapshotTabs = async () => {
  const blobToURL = (b: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(b);
    });
  };

  const tabs = await TabItem.getValue();
  if (tabs.length === 0) return;

  const json = JSON.stringify(tabs);
  const blob = new Blob([json], { type: "application/json" });

  const snapshotLocation: string = await Options.SNAPSHOT_LOCATION.item.getValue();

  await LastSnapshotHashItem.setValue(await hashString(JSON.stringify(tabs)));

  const cd = new Date();
  let dateString: string = "";
  // Form of YYYY-MM-DD_hh-mm-ss
  dateString += `${cd.getFullYear()}-`;
  dateString += `${(cd.getMonth() + 1).toString().padStart(2, "0")}-`;
  dateString += `${cd.getDate().toString().padStart(2, "0")}_`;
  dateString += `${cd.getHours().toString().padStart(2, "0")}-`;
  dateString += `${cd.getMinutes().toString().padStart(2, "0")}-`;
  dateString += `${cd.getSeconds().toString().padStart(2, "0")}`;

  if (import.meta.env.FIREFOX) {
    await browser.downloads.download({
      url: URL.createObjectURL(blob),
      filename: `${snapshotLocation}/${dateString}.json`,
    });
  }

  if (import.meta.env.CHROME) {
    await browser.downloads.download({
      url: await blobToURL(blob),
      filename: `${snapshotLocation}/${dateString}.json`,
    });
  }

  await LastSnapshotDateItem.setValue(Date.now());
};

export const removeNew = async (t: TabV2) => {
  const tabs = (await TabItem.getValue()).map(v => {
    if (v.hash === t.hash) {
      delete v.new;
    }
    return v;
  });

  await TabItem.setValue(tabs);
};
