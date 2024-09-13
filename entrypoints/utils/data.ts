import { TabItem, TabCountItem, SnapshotLocationItem } from "../utils/storage"

export interface Tab {
  title: string;
  url: string;
  date: string;
  hash: string;
};

export const storeTabs = async (newTabs: Tab[]): Promise<void> => {
  const currentTabs = await TabItem.getValue();
  await TabItem.setValue([...currentTabs, ...newTabs]);
};

export const removeTab = async (tabHash: string): Promise<void> => {
  const tabs = await TabItem.getValue();
  const remTabs = tabs.filter((t: Tab) => {
    return !(t.hash === tabHash)
  });
  await TabItem.setValue(remTabs);

  const tabCount: number = await TabCountItem.getValue() ?? 0;
  await TabCountItem.setValue(tabCount - 1);
};

export const snapshotTabs = async () => {
  const tabs = JSON.stringify(await TabItem.getValue());
  const blob = new Blob([tabs], { type: "application/json" })
  const url = URL.createObjectURL(blob);

  const snapshotLocation: string = await SnapshotLocationItem.getValue();

  const cd = new Date();
  let dateString: string = ""
  // Form of YYYY-MM-DD_hh-mm-ss
  dateString += `${cd.getFullYear()}-`
  dateString += `${cd.getMonth().toString().padStart(2, "0")}-`
  dateString += `${cd.getDay().toString().padStart(2, "0")}_`
  dateString += `${cd.getHours().toString().padStart(2, "0")}-`
  dateString += `${cd.getMinutes().toString().padStart(2, "0")}-`
  dateString += `${cd.getSeconds().toString().padStart(2, "0")}`;

  await browser.downloads.download({ url: url, filename: `${snapshotLocation}/${dateString}.json` });
  URL.revokeObjectURL(url);
};
