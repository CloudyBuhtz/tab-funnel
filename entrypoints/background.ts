import { copySyncOp, executeOp, RemOp, syncConOp, SyncOp } from './utils/sync';
import { Omnibox } from "wxt/browser";
import { funnelTabs, removeTabs, snapshotTabs, storeTabs, type TabV2 } from "./utils/data";
import { hashString } from "./utils/misc";
import {
  LastSnapshotDateItem,
  LastSnapshotHashItem,
  LastSyncDateItem,
  TabItem,
} from "./utils/storage";
import { Options } from "./utils/options";
import { funnelLeftTabs, funnelOtherTabs, funnelRightTabs, funnelSelectedTabs, funnelThisTab } from './utils/funnel';

const checkSnapshot = async () => {
  const currentTime = Date.now();
  const lastSnapshotHash: string = await LastSnapshotHashItem.getValue();
  const currentTabs = await TabItem.getValue();

  const lastSnapshotDate: number = await LastSnapshotDateItem.getValue();
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const currentTabsHash: string = await hashString(JSON.stringify(currentTabs));
  if (currentTabsHash === lastSnapshotHash) return;

  const snapshotFrequency = await Options.SNAPSHOT_FREQUENCY.item.getValue();

  switch (snapshotFrequency) {
    case "never":
    case "only_funnel":
    case "every_change":
      return;
    case "hourly":
      if (snapshotDifference >= 3600000) {
        snapshotTabs();
      }
      break;
    case "daily":
      if (snapshotDifference >= 86400000) {
        snapshotTabs();
      }
      break;
    case "weekly":
      if (snapshotDifference >= 604800000) {
        snapshotTabs();
      }
      break;
    case "monthly":
      if (snapshotDifference >= 2629746000) {
        snapshotTabs();
      }
      break;
  }
};

const setupOmnibox = () => {
  browser.omnibox.setDefaultSuggestion({
    description: "Search Tabs Stored in TabFunnel",
  });

  browser.omnibox.onInputChanged.addListener(async (text: string, suggest) => {
    const tabs = await TabItem.getValue();
    const filteredTabs = tabs.filter((t: TabV2) => t.title.toLowerCase().includes(text.toLowerCase()));
    const suggestions: Omnibox.SuggestResult[] = filteredTabs.map((t: TabV2) => {
      let description = t.title;

      if (import.meta.env.CHROME) {
        description = t.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      }

      return {
        content: t.url,
        description: description,
        deletable: false,
      } as Omnibox.SuggestResult;
    });
    suggest(suggestions);
  });

  browser.omnibox.onInputEntered.addListener((text: string, disposition) => {
    if (!text.startsWith("http")) return;

    switch (disposition) {
      case "currentTab":
        browser.tabs.create({
          url: text,
        });
        break;
      case "newBackgroundTab":
        browser.tabs.create({
          url: text,
          active: false,
        });
        break;
      case "newForegroundTab":
        browser.tabs.create({
          url: text,
          active: true,
        });
        break;
    }
  });
};

const setupMenus = async () => {
  const showContextMenu = await Options.SHOW_CONTEXT_MENU.item.getValue();
  if (!showContextMenu) return;

  const parentMenu = browser.menus.create({
    id: "menu_funnel_parent",
    title: "Funnel &Tabs",
    contexts: ["tab"],
    type: "normal"
  });

  const funnelThisMenu = browser.menus.create({
    id: "menu_funnel_this",
    title: "Funnel &This Tab",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: funnelThisTab,
  });

  const funnelOtherMenu = browser.menus.create({
    id: "menu_funnel_other",
    title: "Funnel &Other Tabs",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: funnelOtherTabs,
  });

  const funnelLeftMenu = browser.menus.create({
    id: "menu_funnel_left",
    title: "Funnel Tabs to &Left",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: funnelLeftTabs,
  });

  const funnelRightMenu = browser.menus.create({
    id: "menu_funnel_right",
    title: "Funnel Tabs to &Right",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: funnelRightTabs,
  });

  const funnelSelectedMenu = browser.menus.create({
    id: "menu_funnel_selected",
    title: "Funnel &Selected Tabs",
    contexts: ["tab"],
    parentId: "menu_funnel_parent",
    type: "normal",
    onclick: funnelSelectedTabs,
  });
};

const setupInstalled = () => {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      const url = browser.runtime.getURL("/onboarding.html");
      browser.tabs.create({
        url: url
      });
    }
  });
};

const setupUpdated = () => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "update") {
      const dashboardPinned = await Options.PIN_DASHBOARD.item.getValue();
      const url = browser.runtime.getURL("/dashboard.html");
      const tabs = await browser.tabs.query({
        url: url,
        currentWindow: true,
        pinned: dashboardPinned
      });

      if (tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true });
      } else {
        const newTab = browser.tabs.create({
          url: url,
        });
      }
    }
  });
};

const setupSnapshotAlarm = () => {
  browser.alarms.create("snapshot-alarm", {
    periodInMinutes: 1
  });
  browser.alarms.onAlarm.addListener(a => {
    if (a.name !== "snapshot-alarm") return;
    checkSnapshot();
  });
};

const setupFirefoxSync = async () => {
  browser.alarms.onAlarm.addListener(async a => {
    if (a.name !== "sync-copy-alarm") return;
    const syncEnabled = await Options.TAB_SYNC_ENABLED.item.getValue();
    if (syncEnabled) {
      await copySyncOp();
    }
  });

  browser.storage.sync.onChanged.addListener(async (changes) => {
    const syncEnabled = await Options.TAB_SYNC_ENABLED.item.getValue();
    if (!syncEnabled) return;
    LastSyncDateItem.setValue(Date.now());

    const self = await Options.TAB_SYNC_UUID.item.getValue();
    const keys = Object.keys(changes).filter(k => k.startsWith("sync_op-"));
    keys.forEach(async k => {
      if (k.includes(self)) {
        // console.log("Own Instance Sync Found", changes[k].oldValue, changes[k].newValue);
      } else {
        // console.log("Remote Instance Sync Found", k.replace("sync_op-", ""), changes[k]);

        const oldOps: SyncOp[] = changes[k].oldValue;
        const newOps: SyncOp[] = changes[k].newValue;
        let syncOps: SyncOp[];

        if (newOps === undefined) return;
        if (oldOps === undefined) {
          syncOps = newOps;
        } else {
          syncOps = newOps.filter(n => {
            return !(oldOps.filter(o => o.id === n.id).length > 0);
          });
        }

        // console.log(oldOps, newOps, syncOps);
        // console.log("Running Ops", syncOps);
        const syncOpsCopy = syncOps.slice();
        while (syncOpsCopy.length > 0) {
          const o = syncOpsCopy.shift();
          await executeOp(o!);
        }

        await syncConOp(syncOps);
        await copySyncOp();
      }
    });
  });
};

export default defineBackground(() => {
  setupInstalled();
  setupUpdated();
  setupSnapshotAlarm();
  setupOmnibox();

  if (import.meta.env.FIREFOX) {
    setupMenus();
    setupFirefoxSync();
  }
});
