import { Tab } from "@/entrypoints/utils/data";
import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export const DateGroupTabView = ({ tabs, sort, sortReverse, groupReverse }: TabViewProps): JSX.Element => {
  const groupedTabs = tabs.reduce((ob: { [key: string]: Tab[]; }, item) => ({ ...ob, [item.date]: [...ob[item.date] ?? [], item] }), {});
  const groupedArray = Object.entries(groupedTabs).reverse();

  if (groupReverse) {
    groupedArray.reverse();
  }

  return (
    <>
      {groupedArray.map(([date, tabs]: [string, Tab[]]) => (
        <div className="group" key={date}>
          <div className="info">
            <div className="name">{new Date(parseInt(date)).toLocaleString()}</div>
            <div className="tab-count">{tabs.length} Tab{tabs.length > 1 ? "s" : undefined}</div>
            <div className="spacer"></div>
            <div className="item" onClick={() => openTabs(tabs)}>Open Group</div>
            <div className="item" onClick={() => confirmRemoveTabs(tabs)}>Remove Group</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={sortReverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};