import { Omnibox } from "wxt/browser";
import { snapshotTabs, storeTabs, Tab } from "./utils/data";
import { hashString } from "./utils/misc";
import {
  LastSnapshotDateItem,
  LastSnapshotHashItem,
  SnapshotFrequencyItem,
  TabCountItem,
  TabItem,
} from "./utils/storage";

const checkSnapshot = async () => {
  const currentTime = Date.now();
  const lastSnapshotHash: string = await LastSnapshotHashItem.getValue();
  const currentTabs = await TabItem.getValue();

  const lastSnapshotDate: number = await LastSnapshotDateItem.getValue();
  const snapshotDifference: number = currentTime - lastSnapshotDate;

  const currentTabsHash: string = await hashString(JSON.stringify(currentTabs));
  if (currentTabsHash === lastSnapshotHash) return;

  const snapshotFrequency = await SnapshotFrequencyItem.getValue();

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
    const filteredTabs = tabs.filter((t: Tab) => t.title.toLowerCase().includes(text.toLowerCase()));
    const suggestions: Omnibox.SuggestResult[] = filteredTabs.map((t: Tab) => {
      return {
        content: t.url,
        description: t.title,
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
    console.log(text, disposition);
  });
};

const setupMenus = () => {
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
    onclick: async (info, tab) => {
      const newTab = {
        title: tab.title!,
        url: tab.url!,
        date: Date.now().toString(),
        hash: crypto.randomUUID()
      } satisfies Tab;
      await storeTabs([newTab]);
      await TabCountItem.setValue(await TabCountItem.getValue() + 1);
      browser.tabs.remove([tab.id!]);
    },
  });

  const funnelOtherMenu = browser.menus.create({
    id: "menu_funnel_other",
    title: "Funnel &Other Tabs",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: async (info, tab) => {
      const now = Date.now().toString();
      const tabs = (await browser.tabs.query({
        currentWindow: true,
        url: "*://*/*",
        windowType: "normal"
      })).filter((t) => t.id !== tab.id);
      const newTabs = tabs.map((t) => {
        return {
          title: t.title!,
          url: t.url!,
          date: now,
          hash: crypto.randomUUID()
        } satisfies Tab;
      });

      await storeTabs(newTabs);
      await TabCountItem.setValue(await TabCountItem.getValue() + newTabs.length);
      browser.tabs.remove(tabs.map(t => t.id!));
    },
  });

  const funnelLeftMenu = browser.menus.create({
    id: "menu_funnel_left",
    title: "Funnel Tabs to &Left",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: async (info, tab) => {
      const now = Date.now().toString();
      const tabs = (await browser.tabs.query({
        currentWindow: true,
        url: "*://*/*",
        windowType: "normal"
      })).filter((t) => t.index < tab.index);
      const newTabs = tabs.map((t) => {
        return {
          title: t.title!,
          url: t.url!,
          date: now,
          hash: crypto.randomUUID()
        } satisfies Tab;
      });

      await storeTabs(newTabs);
      await TabCountItem.setValue(await TabCountItem.getValue() + newTabs.length);
      browser.tabs.remove(tabs.map(t => t.id!));
    },
  });

  const funnelRightMenu = browser.menus.create({
    id: "menu_funnel_right",
    title: "Funnel Tabs to &Right",
    contexts: ["tab"],
    type: "normal",
    parentId: "menu_funnel_parent",
    onclick: async (info, tab) => {
      const now = Date.now().toString();
      const tabs = (await browser.tabs.query({
        currentWindow: true,
        url: "*://*/*",
        windowType: "normal"
      })).filter((t) => t.index > tab.index);
      const newTabs = tabs.map((t) => {
        return {
          title: t.title!,
          url: t.url!,
          date: now,
          hash: crypto.randomUUID()
        } satisfies Tab;
      });

      await storeTabs(newTabs);
      await TabCountItem.setValue(await TabCountItem.getValue() + newTabs.length);
      browser.tabs.remove(tabs.map(t => t.id!));
    },
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
    }
  });
};

export default defineBackground(() => {
  setInterval(checkSnapshot, 60000);

  setupOmnibox();
  setupMenus();
  setupInstalled();
  setupUpdated();
});
