import type { TabV2 } from "@/entrypoints/utils/data";
import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export default ({ tabs, sort, sortReverse, groupReverse }: TabViewProps): JSX.Element => {
  const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;

  let groupedTabs = Object.entries(tabs.reduce((ob: { [key: string]: TabV2[]; }, item) => {
    const matches = item.url.match(regex)!;
    const domain: string = matches && matches[1];
    return { ...ob, [domain]: [...ob[domain] ?? [], item] };
  }, {})).sort(([a, _]: [string, TabV2[]], [b, __]: [string, TabV2[]]) => {
    return a.replace("www.", "").localeCompare(b.replace("www.", ""));
  });

  if (groupReverse) {
    groupedTabs.reverse();
  }

  return (
    <>
      {groupedTabs.map(([domain, tabs]: [string, TabV2[]]) => (
        <div className="group" key={domain}>
          <div className="info">
            <div className="name">{domain}</div>
            <div className="tab-count">{i18n.t("main.tabs", tabs.length)}</div>
            <div className="spacer"></div>
            <div className="item" onClick={() => openTabs(tabs)}>{i18n.t("dashboard.tabs.openGroup")}</div>
            <div className="item" onClick={() => confirmRemoveTabs(tabs)}>{i18n.t("dashboard.tabs.removeGroup")}</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={sortReverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};
