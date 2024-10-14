import { Tabs } from 'wxt/browser';
import {
  TabItem,
  TabCountItem,
  SnapshotLocationItem,
  LastSnapshotDateItem,
  SnapshotFrequencyItem,
  LastSnapshotHashItem,
  FunnelPinnedTabsItem,
  IgnoreDuplicateTabsItem,
  RemoveTabsFunnelledItem,
} from "../utils/storage";
import { hashString } from "./misc";

type UUID = `${string}-${string}-${string}-${string}-${string}`;
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
};

type funnelOverrides = {
  funnelPinnedTabs?: boolean;
  ignoreDuplicateTabs?: boolean;
  removeTabsFunnelled?: boolean;
};
export const funnelTabs = async (tabs: Tabs.Tab[], overrides?: funnelOverrides): Promise<void> => {
  const funnelPinnedTabs = overrides?.funnelPinnedTabs ?? await FunnelPinnedTabsItem.getValue();
  const ignoreDuplicateTabs = overrides?.ignoreDuplicateTabs ?? await IgnoreDuplicateTabsItem.getValue();
  const removeTabsFunnelled = overrides?.removeTabsFunnelled ?? await RemoveTabsFunnelledItem.getValue();

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

export const storeTabs = async (newTabs: TabV2[]): Promise<void> => {
  const currentTabs = await TabItem.getValue();
  const tabCount = await TabCountItem.getValue();
  await TabItem.setValue([...currentTabs, ...newTabs]);
  await TabCountItem.setValue(tabCount + newTabs.length);

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();
  if (
    snapshotFrequency === "only_funnel" ||
    snapshotFrequency === "every_change"
  ) {
    await snapshotTabs();
  }
};

export const removeTabs = async (remTabs: Tab[]): Promise<void> => {
  const tabs = await TabItem.getValue();
  const filteredTabs = tabs.filter((t: Tab) => {
    return !(remTabs.filter((v) => v.hash === t.hash).length > 0);
  });
  await TabItem.setValue(filteredTabs);

  const tabCount = await TabCountItem.getValue();
  await TabCountItem.setValue(tabCount - remTabs.length);

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();
  if (snapshotFrequency === "every_change") {
    await snapshotTabs();
  }
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

  const snapshotLocation: string = await SnapshotLocationItem.getValue();

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
