import { useEffect } from "react";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser } from "wxt/browser";
import { StorageItemKey } from "wxt/storage";
import type { Tab } from "../utils/data";
import { TabItem, removeTab } from "../utils/data";
import { Options } from "../utils/options";
import "./Dashboard.css";

function getFavIconURL(url: string) {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];
  return "https://www.google.com/s2/favicons?domain=" + domain;
};

export default () => {
  const [tabs, setTabs] = useState<Tab[]>(TabItem.fallback);
  const [tabCount, setTabCount] = useState(0);
  const [info, setInfo] = useState<Management.ExtensionInfo>();
  const [group, setGroup] = useState<string>("ungrouped");
  const [sort, setSort] = useState<string>("group_by_date");
  const [reverse, setReverse] = useState<boolean>(false);

  const remove_tabs_restored = Options.REMOVE_TABS_RESTORED;
  let removeTabsRestored = useRef(remove_tabs_restored.defaultValue);

  const switch_tab_restored = Options.SWITCH_TAB_RESTORED;
  let switchTabRestored = useRef(switch_tab_restored.defaultValue);

  const unwatchFunnelCount = storage.watch<number>("local:tab_count", (num) => {
    if (num === null) { return }
    setTabCount(num);
  });

  const unwatchTabs = TabItem.watch((items) => {
    console.log(items);
    setTabs(items!);
  });

  const unwatchRemoveTabsRestored = storage.watch<boolean>(`${remove_tabs_restored.area}:${remove_tabs_restored.name}` as StorageItemKey, (val) => {
    removeTabsRestored.current = val ?? false;
  });

  const unwatchSwitchTabRestored = storage.watch<boolean>(`${switch_tab_restored.area}:${switch_tab_restored.name}` as StorageItemKey, (val) => {
    switchTabRestored.current = val ?? false;
  });

  useEffect(() => {
    const setup = async () => {
      setTabs(await TabItem.getValue());
      setTabCount((await storage.getItem("local:tab_count", { fallback: 0 }))!)
      setInfo(await browser.management.getSelf());

      removeTabsRestored.current = await storage.getItem<boolean>(`${remove_tabs_restored.area}:${remove_tabs_restored.name}` as StorageItemKey) ?? false;
      switchTabRestored.current = await storage.getItem<boolean>(`${switch_tab_restored.area}:${switch_tab_restored.name}` as StorageItemKey) ?? false;

      setGroup((await storage.getItem("local:dashboard_group")) ?? "ungrouped");
      setSort((await storage.getItem("local:dashboard_sort")) ?? "sort_by_date");
      setReverse(await storage.getItem("local:dashboard_reverse") ?? false);
    };
    setup();
  }, []);

  const openTab = (item: React.MouseEvent<HTMLElement>) => {
    const tabUrl = item.currentTarget.dataset.url;
    browser.tabs.create({
      url: tabUrl,
      active: switchTabRestored.current
    });

    // Optionally remove tab
    if (removeTabsRestored.current) {
      const tabHash = item.currentTarget.dataset.hash!;
      removeTab(tabHash);
    };
  };

  const closeTab = (item: React.MouseEvent<HTMLElement>) => {
    const hash: string = item.currentTarget.dataset.hash!;
    removeTab(hash);
  };

  const changeGroup = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    await storage.setItem("local:dashboard_group", e.target.value);
  };

  const changeSort = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    await storage.setItem("local:dashboard_sort", e.target.value);
  };

  const reverseChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setReverse(e.target.checked);
    await storage.setItem("local:dashboard_reverse", e.target.checked);
  };

  return (
    <>
      <header>
        <div className="logo">TabFunnel</div>
        <div className="count">Tab Count: {tabCount}</div>
        <div className="info">v{info?.version}</div>
      </header>
      <div className="controls">
        <label htmlFor="group_by">Grouping:</label>
        <div className="select-wrapper">
          <select onChange={changeGroup} value={group} name="group_by" id="group_by">
            <option value="ungrouped">Ungrouped</option>
            <option value="group_by_date">Group by Date</option>
            <option value="group_by_site">Group by Site</option>
          </select>
        </div>
        <span className="spacer"></span>
        <label htmlFor="sort_by">Sorting:</label>
        <div className="select-wrapper">
          <select onChange={changeSort} value={sort} name="sort_by" id="sort_by">
            <option value="sort_by_date">Sort by Date</option>
            <option value="sort_by_name">Sort by Name</option>
            <option value="sort_by_url">Sort by URL</option>
          </select>
        </div>
        <span className="spacer"></span>
        <label htmlFor="reverse_sort">Reverse:</label>
        <input onChange={reverseChange} checked={reverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
      </div>
      <main>
        {group === "ungrouped" && tabs.length > 0 ? <UngroupedView sort={sort as SortType} reverse={reverse} tabs={tabs} openTab={openTab} closeTab={closeTab}></UngroupedView> : null}
        {group === "group_by_date" && tabs.length > 0 ? <DateGroupView sort={sort as SortType} reverse={reverse} tabs={tabs} openTab={openTab} closeTab={closeTab}></DateGroupView> : null}
        {group === "group_by_site" && tabs.length > 0 ? <SiteGroupView sort={sort as SortType} reverse={reverse} tabs={tabs} openTab={openTab} closeTab={closeTab}></SiteGroupView> : null}
      </main>
    </>
  );
};

type SortType = "sort_by_date" | "sort_by_name" | "sort_by_url";
type TabViewProps = {
  tabs: Tab[],
  openTab: React.MouseEventHandler,
  closeTab: React.MouseEventHandler,
  sort: SortType;
  reverse: boolean;
};

const SortedTabView = ({ tabs, sort, reverse, openTab, closeTab }: TabViewProps): JSX.Element => {
  let sortedTabs: Tab[] = tabs.slice(0);

  switch (sort) {
    case "sort_by_date":
      sortedTabs.sort((a, b) => { return parseInt(a.date) - parseInt(b.date) });
      break;
    case "sort_by_name":
      sortedTabs.sort((a, b) => { return a.title.localeCompare(b.title) });
      break;
    case "sort_by_url":
      sortedTabs.sort((a, b) => { return a.url.localeCompare(b.url) });
      break;
  }

  if (reverse) {
    sortedTabs.reverse()
  }

  return (
    <>{sortedTabs.map((tab: Tab) => (
      <div key={tab.hash} className="tab">
        <div onClick={closeTab} data-hash={tab.hash} className="close">X</div>
        <img className="icon" src={getFavIconURL(tab.url)} alt={tab.title} />
        <span onClick={openTab} className="title" data-hash={tab.hash} data-url={tab.url}>{tab.title}</span>
      </div>
    ))}
    </>
  )
};

const UngroupedView = ({ tabs, openTab, closeTab, sort = "sort_by_date", reverse }: TabViewProps): JSX.Element => {
  return (
    <SortedTabView tabs={tabs} sort={sort} reverse={reverse} openTab={openTab} closeTab={closeTab}></SortedTabView>
  )
};

const SiteGroupView = ({ tabs, openTab, closeTab, sort, reverse }: TabViewProps): JSX.Element => {
  const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;

  const groupedTabs = Object.entries(tabs.reduce((ob: { [key: string]: Tab[] }, item) => {
    const matches = item.url.match(regex)!;
    const domain: string = matches && matches[1];
    return { ...ob, [domain]: [...ob[domain] ?? [], item] }
  }, {}));

  return (
    <>
      {groupedTabs.map(([domain, tabs]: [string, Tab[]]) => (
        <div className="group" key={domain}>
          <div className="name">{domain}</div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse} openTab={openTab} closeTab={closeTab}></SortedTabView>
        </div>
      ))}
    </>
  );
};

const DateGroupView = ({ tabs, openTab, closeTab, sort, reverse }: TabViewProps): JSX.Element => {
  const groupedTabs = tabs.reduce((ob: { [key: string]: Tab[] }, item) => ({ ...ob, [item.date]: [...ob[item.date] ?? [], item] }), {});
  return (
    <>
      {Object.entries(groupedTabs).reverse().map(([date, tabs]: [string, Tab[]]) => (
        <div className="group" key={date}>
          <div className="name">{new Date(parseInt(date)).toUTCString()}</div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse} openTab={openTab} closeTab={closeTab}></SortedTabView>
        </div>
      ))}
    </>
  );
};
