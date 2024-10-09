import type { TabV2 } from "@/entrypoints/utils/data";
import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export default ({ tabs, sort, sortReverse, groupReverse }: TabViewProps): JSX.Element => {
  const groupedTabs = tabs.sort((a, b) => {
    return Number.parseInt(a.date) - Number.parseInt(b.date);
  }).reduce((ob: { [key: string]: TabV2[]; }, item) => ({ ...ob, [item.date]: [...ob[item.date] ?? [], item] }), {});
  const groupedArray = Object.entries(groupedTabs).reverse();

  if (groupReverse) {
    groupedArray.reverse();
  }

  return (
    <>
      {groupedArray.map(([date, tabs]: [string, TabV2[]]) => (
        <div className="group" key={date}>
          <div className="info">
            <div className="name">{new Date(parseInt(date)).toLocaleString()}</div>
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
