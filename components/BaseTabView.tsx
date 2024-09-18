import { removeTabs, Tab } from "@/entrypoints/utils/data";
import { RemoveTabsRestoredItem, SwitchTabRestoredItem, TSort } from "@/entrypoints/utils/storage";

export type TabViewProps = {
  tabs: Tab[];
  sort: TSort;
  groupReverse: boolean;
  sortReverse: boolean;
};

export const openTabs = async (opTabs: Tab[]) => {
  const switchTabRestored = await SwitchTabRestoredItem.getValue();
  const removeTabsRestored = await RemoveTabsRestoredItem.getValue();
  opTabs.forEach((tab) => {
    browser.tabs.create({
      url: tab.url,
      active: switchTabRestored,
    });
  });

  if (removeTabsRestored) {
    removeTabs(opTabs);
  }
};

export const confirmRemoveTabs = (remTabs: Tab[]) => {
  if (remTabs.length > 1 && !confirm(`Are you sure you want to remove ${remTabs.length} Tabs?`)) return;
  removeTabs(remTabs);
};

const getFavIconURL = (url: string) => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];
  return "https://www.google.com/s2/favicons?domain=" + domain;
};

type SortedTabViewProps = {
  tabs: Tab[];
  sort: TSort;
  reverse: boolean;
};
export const SortedTabView = ({ tabs, sort, reverse }: SortedTabViewProps): JSX.Element => {
  let sortedTabs: Tab[] = tabs.slice(0);

  switch (sort) {
    case "sort_by_date":
      sortedTabs.sort((a, b) => { return parseInt(a.date) - parseInt(b.date); });
      break;
    case "sort_by_name":
      sortedTabs.sort((a, b) => { return a.title.localeCompare(b.title); });
      break;
    case "sort_by_url":
      sortedTabs.sort((a, b) => { return a.url.localeCompare(b.url); });
      break;
  }

  if (reverse) {
    sortedTabs.reverse();
  }

  return (
    <>{sortedTabs.map((tab: Tab) => (
      <div key={tab.hash} className="tab">
        <div onClick={() => confirmRemoveTabs([tab])} className="close">X</div>
        <img className="icon" src={getFavIconURL(tab.url)} alt={tab.title} />
        <span onClick={() => openTabs([tab])} className="title">{tab.title}</span>
      </div>
    ))}
    </>
  );
};