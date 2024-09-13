import { useEffect, useState } from "react";
import { Md5 } from "ts-md5";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser } from "wxt/browser";
import { storage, StorageItemKey } from "wxt/storage";
import { TabItem, snapshotTabs, storeTabs, type Tab } from "../utils/data";
import { Options } from "../utils/options";
import "./Popup.css";

export default () => {
  const [funnelCount, setFunnelCount] = useState(0);
  const [info, setInfo] = useState<Management.ExtensionInfo>();

  const funnel_pinned_tabs = Options.FUNNEL_PINNED_TABS;
  let funnelPinnedTabs = useRef(funnel_pinned_tabs.defaultValue);

  const remove_tab_funnelled = Options.REMOVE_TABS_FUNNELLED;
  let removeTabFunnelled = useRef(remove_tab_funnelled.defaultValue);

  const ignore_duplicate_tabs = Options.IGNORE_DUPLICATE_TABS;
  let ignoreDuplicateTabs = useRef(ignore_duplicate_tabs.defaultValue);

  const [lastSnapshotDate, setLastSnapshotDate] = useState(0);

  const unwatchFunnelCount = storage.watch<number>("local:tab_count", (count) => {
    setFunnelCount(count!);
  });

  useEffect(() => {
    const getCount = async () => {
      setFunnelCount(await storage.getItem<number>("local:tab_count") ?? 0);

      funnelPinnedTabs.current = await storage.getItem<boolean>(`${funnel_pinned_tabs.area}:${funnel_pinned_tabs.name}` as StorageItemKey) || false;
      removeTabFunnelled.current = await storage.getItem<boolean>(`${remove_tab_funnelled.area}:${remove_tab_funnelled.name}` as StorageItemKey) || false;
      ignoreDuplicateTabs.current = await storage.getItem<boolean>(`${ignore_duplicate_tabs.area}:${ignore_duplicate_tabs.name}` as StorageItemKey) || false;
      setLastSnapshotDate(await storage.getItem("local:last_snapshot_date") ?? 0);
    };
    getCount();
  }, []);

  const funnelTabs = async () => {
    const tabCount = await storage.setItem<number>(
      "local:tab_count",
      funnelCount,
    );

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
    console.log(funnelDate);
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
    await storage.setItem("local:tab_count", newCount);

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
      <div className="info">Tabs Funnelled: {funnelCount}</div>
      <button onClick={funnelTabs}>Funnel All Tabs</button>
      <button onClick={showList}>Show Funnel</button>
      <button onClick={manualSnapshot}>Manual Snapshot</button>
      <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : new Date(lastSnapshotDate).toUTCString()}</div>
    </main>
  );
};
