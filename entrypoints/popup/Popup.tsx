import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { snapshotTabs, storeTabs, type TabV2 } from "../utils/data";
import {
  FunnelPinnedTabsItem,
  IgnoreDuplicateTabsItem,
  LastSnapshotDateItem,
  RemoveTabsFunnelledItem,
  TabCountItem,
  TabItem
} from "../utils/storage";
import "./Popup.css";
import { convertBytes, timeAgo } from "../utils/misc";

export default () => {
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);
  const [storeSize, setStoreSize] = useState(0);

  const funnelPinnedTabs = useRef(FunnelPinnedTabsItem.fallback);
  const removeTabFunnelled = useRef(RemoveTabsFunnelledItem.fallback);
  const ignoreDuplicateTabs = useRef(IgnoreDuplicateTabsItem.fallback);

  const unwatchTabCount = TabCountItem.watch(v => setTabCount(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch(v => setLastSnapshotDate(v));

  useEffect(() => {
    const getCount = async () => {
      setTabCount(await TabCountItem.getValue());
      setLastSnapshotDate(await LastSnapshotDateItem.getValue());
      // So so on this thing, kind of a waste
      const blob = new Blob([JSON.stringify(await TabItem.getValue())]);
      setStoreSize(blob.size);

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
      return (storedTabs.find((val: TabV2) => {
        return val.url === url;
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
    let tabsToFunnel: TabV2[] = await Promise.all(tabs.map(async (tab, index: number) => {
      return {
        title: tab.title!,
        url: tab.url!.toString(),
        date: funnelDate,
        hash: crypto.randomUUID(),
        pinned: tab.pinned
      } satisfies TabV2;
    }));

    // Optionally remove duplicates
    if (ignoreDuplicateTabs.current) {
      tabsToFunnel = tabsToFunnel.filter((tab: TabV2) => {
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
          return tab.id!;
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

  const showOptions = async () => {
    const url = browser.runtime.getURL("/options.html");
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

  const showVersions = async () => {
    const url = browser.runtime.getURL("/versions.html");
    browser.tabs.create({
      url: url,
      active: true,
    });
  };

  const showGithub = async () => { };

  return (
    <main>
      <div className="info">{i18n.t("main.tabs", tabCount)} | {convertBytes(storeSize)}</div>
      <div className="info">{i18n.t("dashboard.info.lastSnapshot")}: {lastSnapshotDate === 0 ? i18n.t("dashboard.info.never") : timeAgo(lastSnapshotDate)}</div>
      <button onClick={funnelTabs}>{i18n.t("popup.funnelAllTabs")}</button>
      <button onClick={showList}>{i18n.t("popup.showDashboard")}</button>
      <button onClick={manualSnapshot}>{i18n.t("popup.manualSnapshot")}</button>
      <div onClick={showVersions} className="info version">{i18n.t("main.version", [browser.runtime.getManifest().version])}</div>
      <div onClick={showOptions} className="cog">
        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"></path></svg>
      </div>
    </main>
  );
};
