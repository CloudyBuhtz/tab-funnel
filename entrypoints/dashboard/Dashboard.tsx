import { useEffect } from "react";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser } from "wxt/browser";
import type { Tab } from "../utils/data";
import { removeTab } from "../utils/data";
import {
  LastSnapshotDateItem,
  RemoveTabsRestoredItem,
  SwitchTabRestoredItem,
  TabCountItem,
  TabItem
} from "../utils/storage";
import "./Dashboard.css";

function getFavIconURL(url: string) {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];
  return "https://www.google.com/s2/favicons?domain=" + domain;
};

type TGroup = "ungrouped" | "group_by_date" | "group_by_site";
const GroupItem = storage.defineItem<TGroup>("local:dashboard_group", {
  fallback: "ungrouped",
});

type TSort = "sort_by_date" | "sort_by_name" | "sort_by_url";
const SortItem = storage.defineItem<TSort>("local:dashboard_sort", {
  fallback: "sort_by_date",
});

const ReverseItem = storage.defineItem<boolean>("local:dashboard_reverse", {
  fallback: false,
});

const openTabs = async (opTabs: Tab[]) => {
  const switchTabRestored = await SwitchTabRestoredItem.getValue();
  const removeTabsRestored = await RemoveTabsRestoredItem.getValue();
  opTabs.forEach((tab) => {
    browser.tabs.create({
      url: tab.url,
      active: switchTabRestored
    });
  })

  // Optionally remove tab
  if (removeTabsRestored) {
    removeTab(opTabs);
  };
};

export default () => {
  const [tabs, setTabs] = useState<Tab[]>(TabItem.fallback);
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [info, setInfo] = useState<Management.ExtensionInfo>();
  const [group, setGroup] = useState<string>(GroupItem.fallback);
  const [sort, setSort] = useState<string>(SortItem.fallback);
  const [reverse, setReverse] = useState<boolean>(ReverseItem.fallback);

  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);

  const unwatchTabCount = TabCountItem.watch(v => setTabCount(v));
  const unwatchTabs = TabItem.watch(v => setTabs(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch(v => setLastSnapshotDate(v))

  useEffect(() => {
    const setup = async () => {
      setTabs(await TabItem.getValue());
      setTabCount(await TabCountItem.getValue());
      setInfo(await browser.management.getSelf());

      setLastSnapshotDate(await LastSnapshotDateItem.getValue());

      setGroup(await GroupItem.getValue());
      setSort(await SortItem.getValue());
      setReverse(await ReverseItem.getValue());
    };
    setup();
  }, []);

  const changeGroup = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    await GroupItem.setValue(e.target.value as TGroup);
  };

  const changeSort = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    await SortItem.setValue(e.target.value as TSort);
  };

  const reverseChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setReverse(e.target.checked);
    await ReverseItem.setValue(e.target.checked);
  };

  return (
    <>
      <header>
        <div className="logo">TabFunnel</div>
        <div className="count">Tab Count: {tabCount}</div>
        <div className="info">v{info?.version}</div>
        <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : new Date(lastSnapshotDate).toLocaleString()}</div>
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
        {group === "ungrouped" ? <UngroupedView sort={sort as TSort} reverse={reverse} tabs={tabs}></UngroupedView> : null}
        {group === "group_by_date" ? <DateGroupView sort={sort as TSort} reverse={reverse} tabs={tabs}></DateGroupView> : null}
        {group === "group_by_site" ? <SiteGroupView sort={sort as TSort} reverse={reverse} tabs={tabs}></SiteGroupView> : null}
      </main>
    </>
  );
};

type SortType = "sort_by_date" | "sort_by_name" | "sort_by_url";
type TabViewProps = {
  tabs: Tab[],
  sort: TSort;
  reverse: boolean;
};

const SortedTabView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
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
        <div onClick={() => removeTab([tab])} className="close">X</div>
        <img className="icon" src={getFavIconURL(tab.url)} alt={tab.title} />
        <span onClick={() => openTabs([tab])} className="title">{tab.title}</span>
      </div>
    ))}
    </>
  )
};

const UngroupedView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  return (
    <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
  )
};

const SiteGroupView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
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
          <div className="info">
            <div className="name">{domain}</div>
            <div className="spacer"></div>
            <div className="openAll" onClick={() => openTabs(tabs)}>Restore All</div>
            <div className="removeAll" onClick={() => removeTab(tabs)}>Remove All</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};

const DateGroupView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  const groupedTabs = tabs.reduce((ob: { [key: string]: Tab[] }, item) => ({ ...ob, [item.date]: [...ob[item.date] ?? [], item] }), {});
  return (
    <>
      {Object.entries(groupedTabs).reverse().map(([date, tabs]: [string, Tab[]]) => (
        <div className="group" key={date}>
          <div className="info">
            <div className="name">{new Date(parseInt(date)).toUTCString()}</div>
            <div className="spacer"></div>
            <div className="openAll" onClick={() => openTabs(tabs)}>Restore All</div>
            <div className="removeAll" onClick={() => removeTab(tabs)}>Remove All</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};
