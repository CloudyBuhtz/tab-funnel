import { funnelTabs } from "./data";
import { Menus, Tabs } from "wxt/browser";

export const funnelThisTab = async (_info: any, tab: Tabs.Tab) => {
  await funnelTabs([tab], {
    funnelPinnedTabs: true
  });
};

export const funnelOtherTabs = async (_info: any, tab: Tabs.Tab) => {
  const tabs = (await browser.tabs.query({
    currentWindow: true,
    url: "*://*/*",
    windowType: "normal",
  })).filter((t) => t.id !== tab.id);

  await funnelTabs(tabs);
};

export const funnelLeftTabs = async (_info: any, tab: Tabs.Tab) => {
  const tabs = (await browser.tabs.query({
    currentWindow: true,
    url: "*://*/*",
    windowType: "normal",
  })).filter((t) => t.index < tab.index);

  await funnelTabs(tabs);
};

export const funnelRightTabs = async (_info: any, tab: Tabs.Tab) => {
  const tabs = (await browser.tabs.query({
    currentWindow: true,
    url: "*://*/*",
    windowType: "normal",
  })).filter((t) => t.index > tab.index);

  await funnelTabs(tabs);
};

export const funnelSelectedTabs = async (_info: any, tab: Tabs.Tab) => {
  const tabs = (await browser.tabs.query({
    currentWindow: true,
    url: "*://*/*",
    windowType: "normal",
    highlighted: true
  }));

  await funnelTabs(tabs);
};
