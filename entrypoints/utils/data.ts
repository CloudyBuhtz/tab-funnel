import { storage } from "wxt/storage";

export interface Tab {
  title: string;
  url: string;
  date: string;
  hash: string;
};

export const TabItem = storage.defineItem("local:tabs", {
  fallback: [],
});

export const storeTabs = async (newTabs: Tab[]): Promise<void> => {
  const currentTabs = await TabItem.getValue();
  await storage.setItem<Tab[]>("local:tabs", [...currentTabs, ...newTabs]);
};

export const removeTab = async (tabHash: string): Promise<void> => {
  const tabs = await TabItem.getValue();
  const remTabs = tabs.filter((t: Tab) => {
    return !(t.hash === tabHash)
  });
  await storage.setItem<Tab[]>("local:tabs", remTabs);

  const tabCount: number = await storage.getItem("local:tab_count") ?? 0;
  await storage.setItem("local:tab_count", tabCount - 1);
};

export const snapshotTabs = async () => {
  const tabs = JSON.stringify(await TabItem.getValue());
  const blob = new Blob([tabs], { type: "application/json" })
  const url = URL.createObjectURL(blob);

  const snapshotLocation: string = (await storage.getItem("local:snapshot_location"))!;

  const cd = new Date();
  const dateString: string = `${cd.getFullYear()}-${cd.getMonth().toString().padStart(2, "0")}-${cd.getDay().toString().padStart(2, "0")}_${cd.getHours().toString().padStart(2, "0")}-${cd.getMinutes().toString().padStart(2, "0")}-${cd.getSeconds().toString().padStart(2, "0")}`;

  await browser.downloads.download({ url: url, filename: `${snapshotLocation}/${dateString}.json` });
  URL.revokeObjectURL(url);
};

const makeSnapshot = async () => { };
