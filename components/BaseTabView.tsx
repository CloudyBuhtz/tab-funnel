import { removeTabs, TabV2 } from "@/entrypoints/utils/data";
import { RemoveTabsRestoredItem, RestoreAsPinnedItem, SwitchTabRestoredItem, type TGranularity, type TSort } from "@/entrypoints/utils/storage";

export type TabViewProps = {
  tabs: TabV2[];
  sort: TSort;
  groupReverse: boolean;
  sortReverse: boolean;
  granularity?: TGranularity;
};

export const openTabs = async (opTabs: TabV2[]) => {
  const switchTabRestored = await SwitchTabRestoredItem.getValue();
  const removeTabsRestored = await RemoveTabsRestoredItem.getValue();
  const restoreAsPinned = await RestoreAsPinnedItem.getValue();
  opTabs.forEach((tab) => {
    browser.tabs.create({
      url: tab.url,
      active: switchTabRestored,
      pinned: restoreAsPinned && tab.pinned
    });
  });

  if (removeTabsRestored) {
    removeTabs(opTabs);
  }
};

export const confirmRemoveTabs = (remTabs: TabV2[]) => {
  if (remTabs.length > 1 && !confirm(i18n.t("dashboard.tabs.confirm", [i18n.t("main.tabs", remTabs.length)]))) return;
  removeTabs(remTabs);
};

const getFavIconURL = (url: string) => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
};

type SortedTabViewProps = {
  tabs: TabV2[];
  sort: TSort;
  reverse: boolean;
};
export const SortedTabView = ({ tabs, sort, reverse }: SortedTabViewProps): JSX.Element => {
  let sortedTabs: TabV2[] = tabs.slice(0);

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
    <>
      {sortedTabs.map((tab: TabV2) => (
        <div key={tab.hash} className="tab" data-url={tab.url}>
          <span onClick={() => confirmRemoveTabs([tab])} className="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg>
          </span>
          <img className="icon" src={getFavIconURL(tab.url)} alt={tab.title} onError={(e) => { e.currentTarget.src = '/fallback.png'; }} />
          {tab.pinned && <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z"></path></svg>}
          <span onClick={() => openTabs([tab])} className="title">{tab.title}</span>
        </div>
      ))}
    </>
  );
};
