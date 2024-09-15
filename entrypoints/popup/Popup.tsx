import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { snapshotTabs, storeTabs, type Tab } from "../utils/data";
import {
  FunnelPinnedTabsItem,
  IgnoreDuplicateTabsItem,
  LastSnapshotDateItem,
  RemoveTabsFunnelledItem,
  TabCountItem,
  TabItem
} from "../utils/storage";
import "./Popup.css";
import { convertBytes, hashString } from "../utils/misc";

export default () => {
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);
  const [storeSize, setStoreSize] = useState(0);

  const funnelPinnedTabs = useRef(FunnelPinnedTabsItem.fallback);
  const removeTabFunnelled = useRef(RemoveTabsFunnelledItem.fallback);
  const ignoreDuplicateTabs = useRef(IgnoreDuplicateTabsItem.fallback);

  const unwatchTabCount = TabCountItem.watch(v => setTabCount(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch(v => setLastSnapshotDate(v))

  useEffect(() => {
    const getCount = async () => {
      setTabCount(await TabCountItem.getValue());
      setLastSnapshotDate(await LastSnapshotDateItem.getValue());
      // So so on this thing, kind of a waste
      const blob = new Blob([JSON.stringify(await TabItem.getValue())]);
      setStoreSize(blob.size)

      funnelPinnedTabs.current = await FunnelPinnedTabsItem.getValue();
      removeTabFunnelled.current = await RemoveTabsFunnelledItem.getValue();
      ignoreDuplicateTabs.current = await IgnoreDuplicateTabsItem.getValue();
    };
    getCount();
  }, []);

  const funnelTabs = async () => {
    // Get current tabs
    const storedTabs = await TabItem.getValue();
    const hasTab = (url: string) => {
      return (storedTabs.find((val: Tab) => {
        return val.url === url
      })) ? true : false;
    };

    // Get tabs
    const tabs = await browser.tabs.query({
      currentWindow: true,
      pinned: funnelPinnedTabs.current ? undefined : false,
      url: "*://*/*",
      windowType: "normal"
    });

    // Create tab data
    const funnelDate = Date.now().toString();
    let tabsToFunnel: Tab[] = await Promise.all(tabs.map(async (tab, index: number) => {
      const tabHash = await hashString(`${funnelDate}/${index.toString()}`);
      return {
        title: tab.title!,
        url: tab.url!.toString(),
        date: funnelDate,
        hash: tabHash
      } satisfies Tab;
    }));

    // Optionally remove duplicates
    if (ignoreDuplicateTabs.current) {
      tabsToFunnel = tabsToFunnel.filter((tab: Tab) => {
        return !hasTab(tab.url);
      });
    };
    storeTabs(tabsToFunnel);
    const newCount = tabCount + tabsToFunnel.length;
    await TabCountItem.setValue(newCount);

    // Optionally close tabs
    if (removeTabFunnelled.current) {
      browser.tabs.remove(
        tabs.map((tab) => {
          return tab.id!
        })
      );
    };
  };

  const showList = async () => {
    const url = browser.runtime.getURL("/dashboard.html");
    const tabs = await browser.tabs.query({
      url: url,
      currentWindow: true,
    });

    if (tabs.length > 0) {
      browser.tabs.update(tabs[0].id, { active: true });
    } else {
      const newTab = browser.tabs.create({
        url: url,
      });
    }

    window.close();
  };

  const manualSnapshot = async () => {
    await snapshotTabs();
  };

  return (
    <main>
      <div className="info">{tabCount} Tabs | {convertBytes(storeSize)}</div>
      <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : new Date(lastSnapshotDate).toLocaleString()}</div>
      <button onClick={funnelTabs}>Funnel All Tabs</button>
      <button onClick={showList}>Show Funnel</button>
      <button onClick={manualSnapshot}>Manual Snapshot</button>
      <div className="info">Version {browser.runtime.getManifest().version}</div>
    </main>
  );
};
