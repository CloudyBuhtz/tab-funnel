import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export default ({ tabs, sort, sortReverse: reverse }: TabViewProps): JSX.Element => {
  return (
    <>
      <div className="group">
        <div className="info">
          <div className="name">{i18n.t("dashboard.tabs.allTabs")}</div>
          <div className="spacer"></div>
          <div className="item" onClick={() => openTabs(tabs)}>{i18n.t("dashboard.tabs.openAll")}</div>
          <div className="item" onClick={() => confirmRemoveTabs(tabs)}>{i18n.t("dashboard.tabs.removeAll")}</div>
        </div>
        <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
      </div>
    </>
  );
};
