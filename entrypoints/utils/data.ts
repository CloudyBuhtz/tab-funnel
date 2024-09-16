import {
  TabItem,
  TabCountItem,
  SnapshotLocationItem,
  LastSnapshotDateItem,
  SnapshotFrequencyItem,
  LastSnapshotHashItem
} from "../utils/storage"
import { hashString } from "./misc";

export interface Tab {
  title: string;
  url: string;
  date: string;
  hash: string;
};

export const storeTabs = async (newTabs: Tab[]): Promise<void> => {
  const currentTabs = await TabItem.getValue();
  await TabItem.setValue([...currentTabs, ...newTabs]);

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();
  if (snapshotFrequency === "only_funnel" || snapshotFrequency === "every_change") {
    await snapshotTabs();
  }
};

export const removeTabs = async (remTabs: Tab[]): Promise<void> => {
  const tabs = await TabItem.getValue();
  const filteredTabs = tabs.filter((t: Tab) => {
    return !(remTabs.filter(v => v.hash === t.hash).length > 0)
  });
  await TabItem.setValue(filteredTabs);

  const tabCount: number = await TabCountItem.getValue() ?? 0;
  await TabCountItem.setValue(tabCount - remTabs.length);

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();
  if (snapshotFrequency === "every_change") {
    await snapshotTabs();
  }
};

export const snapshotTabs = async () => {
  const tabs = await TabItem.getValue();
  if (tabs.length === 0) return

  const json = JSON.stringify(tabs);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const snapshotLocation: string = await SnapshotLocationItem.getValue();

  await LastSnapshotHashItem.setValue(await hashString(JSON.stringify(tabs)));

  const cd = new Date();
  let dateString: string = ""
  // Form of YYYY-MM-DD_hh-mm-ss
  dateString += `${cd.getFullYear()}-`;
  dateString += `${(cd.getMonth() + 1).toString().padStart(2, "0")}-`;
  dateString += `${cd.getDate().toString().padStart(2, "0")}_`;
  dateString += `${cd.getHours().toString().padStart(2, "0")}-`;
  dateString += `${cd.getMinutes().toString().padStart(2, "0")}-`;
  dateString += `${cd.getSeconds().toString().padStart(2, "0")}`;

  await browser.downloads.download({ url: url, filename: `${snapshotLocation}/${dateString}.json` });
  await LastSnapshotDateItem.setValue(Date.now())
  URL.revokeObjectURL(url);
};
