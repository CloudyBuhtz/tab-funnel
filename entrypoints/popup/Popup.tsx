import { useEffect, useState } from "react";
import { Md5 } from "ts-md5";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser } from "wxt/browser";
import { storage, StorageItemKey } from "wxt/storage";
import { snapshotTabs, storeTabs, type Tab } from "../utils/data";
import { FunnelPinnedTabsItem, IgnoreDuplicateTabsItem, LastSnapshotDate, RemoveTabsFunnelledItem, TabCountItem, TabItem } from "../utils/storage";
import { Options } from "../utils/options";
import "./Popup.css";

export default () => {
  const [funnelCount, setFunnelCount] = useState(0);
  const [info, setInfo] = useState<Management.ExtensionInfo>();

  const funnelPinnedTabs = useRef(FunnelPinnedTabsItem.fallback);
  const removeTabFunnelled = useRef(RemoveTabsFunnelledItem.fallback);
  const ignoreDuplicateTabs = useRef(IgnoreDuplicateTabsItem.fallback);

  const [lastSnapshotDate, setLastSnapshotDate] = useState(0);

  const unwatchFunnelCount = TabCountItem.watch((count) => {
    setFunnelCount(count);
  });

  useEffect(() => {
    const getCount = async () => {
      setFunnelCount(await TabCountItem.getValue());

      funnelPinnedTabs.current = await FunnelPinnedTabsItem.getValue();
      removeTabFunnelled.current = await RemoveTabsFunnelledItem.getValue();
      ignoreDuplicateTabs.current = await IgnoreDuplicateTabsItem.getValue();
      setLastSnapshotDate(await LastSnapshotDate.getValue());
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
    let tabsToFunnel: Tab[] = tabs.map((tab, index: number) => {
      return {
        title: tab.title!,
        url: tab.url!.toString(),
        date: funnelDate,
        hash: Md5.hashStr(`${funnelDate}/${index.toString()}`)
      } satisfies Tab;
    });

    // Optionally remove duplicates
    if (ignoreDuplicateTabs.current) {
      tabsToFunnel = tabsToFunnel.filter((tab: Tab) => {
        return !hasTab(tab.url);
      });
    }
    storeTabs(tabsToFunnel);
    const newCount = funnelCount + tabsToFunnel.length;
    await TabCountItem.setValue(newCount);

    // Optionally close tabs
    if (removeTabFunnelled.current) {
      browser.tabs.remove(
        tabs.map((tab) => {
          return tab.id!
        })
      );
    }
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
      <div className="info">{funnelCount} Tabs</div>
      <button onClick={funnelTabs}>Funnel All Tabs</button>
      <button onClick={showList}>Show Funnel</button>
      <button onClick={manualSnapshot}>Manual Snapshot</button>
      <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : new Date(lastSnapshotDate).toUTCString()}</div>
    </main>
  );
};
