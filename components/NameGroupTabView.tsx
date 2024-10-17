import type { TabV2 } from "@/entrypoints/utils/data";
import { TabViewProps } from "./BaseTabView";

export default ({ tabs, sort, sortReverse, groupReverse }: TabViewProps): JSX.Element => {
  let groupedTabs = Object.entries(tabs.reduce((ob: { [key: string]: TabV2[]; }, item) => {
    let letter = item.title[0].toUpperCase();

    if (!isNaN(parseInt(letter))) {
      letter = "0-9";
    } else if ((/[\[|\\/~^:,;?!&%$@*+\.\]]/).test(letter)) {
      letter = `[Symbols]`;
    }

    return { ...ob, [letter]: [...ob[letter] ?? [], item] };
  }, {})).sort(([a, _]: [string, TabV2[]], [b, __]: [string, TabV2[]]) => {
    return a.localeCompare(b);
  });

  if (groupReverse) {
    groupedTabs.reverse();
  }

  return (
    <>
      {groupedTabs.map(([letter, tabs]: [string, TabV2[]]) => (
        <div className="group" key={letter}>
          <div className="info">
            <div className="name">{letter}</div>
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
