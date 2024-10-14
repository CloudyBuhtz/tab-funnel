import type { TabV2 } from "@/entrypoints/utils/data";
import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";
import type { TGranularity } from "@/entrypoints/utils/storage";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export default ({ tabs, sort, sortReverse, groupReverse, granularity }: TabViewProps): JSX.Element => {
  const granularityTransform = (g: TGranularity, n: number): number => {
    switch (g) {
      case "seconds":
        return dayjs(n).startOf("second").valueOf();
      case "minutes":
        return dayjs(n).startOf("minute").valueOf();
      case "hours":
        return dayjs(n).startOf("hour").valueOf();
      case "days":
        return dayjs(n).startOf("day").valueOf();
      case "weeks":
        return dayjs(n).startOf("isoWeek").valueOf();
      case "months":
        return dayjs(n).startOf("month").valueOf();
      case "years":
        return dayjs(n).startOf("year").valueOf();
    }
  };

  const granularityTitle = (g: TGranularity, d: number): string => {
    const date = new Date(d);
    switch (g) {
      case "seconds":
        return date.toLocaleString();
      case "minutes":
      case "hours":
        return date.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric"
        });
      case "days":
        return date.toLocaleDateString();
      case "weeks":
        return i18n.t("dashboard.tabs.weekStarting", [date.toLocaleDateString()]);
      case "months":
        return date.toLocaleString(undefined, { month: "long", year: "numeric" });
      case "years":
        return date.getFullYear().toString();
    }
  };

  const groupedTabs = tabs.map(t => {
    return {
      title: t.title,
      url: t.url,
      date: granularityTransform(granularity!, parseInt(t.date)).toString(),
      hash: t.hash,
      pinned: t.pinned
    } satisfies TabV2;
  }).sort((a, b) => {
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
            <div className="name">{granularityTitle(granularity!, parseInt(date))}</div>
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
