import { Tab } from "@/entrypoints/utils/data";
import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export const SiteGroupTabView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;

  const groupedTabs = Object.entries(tabs.reduce((ob: { [key: string]: Tab[] }, item) => {
    const matches = item.url.match(regex)!;
    const domain: string = matches && matches[1];
    return { ...ob, [domain]: [...ob[domain] ?? [], item] }
  }, {})).sort(([a, _]: [string, Tab[]], [b, __]: [string, Tab[]]) => {
    return a.replace("www.", "").localeCompare(b.replace("www.", ""));
  });

  return (
    <>
      {groupedTabs.map(([domain, tabs]: [string, Tab[]]) => (
        <div className="group" key={domain}>
          <div className="info">
            <div className="name">{domain}</div>
            <div className="tabCount">{tabs.length} Tab{tabs.length > 1 ? "s" : undefined}</div>
            <div className="spacer"></div>
            <div className="item" onClick={() => openTabs(tabs)}>Open Group</div>
            <div className="item" onClick={() => confirmRemoveTabs(tabs)}>Remove Group</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};