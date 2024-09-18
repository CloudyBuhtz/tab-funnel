import { confirmRemoveTabs, openTabs, SortedTabView, TabViewProps } from "./BaseTabView";

export const UngroupedTabView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  return (
    <>
      <div className="group">
        <div className="info">
          <div className="name">All Tabs</div>
          <div className="spacer"></div>
          <div className="item" onClick={() => openTabs(tabs)}>Open All</div>
          <div className="item" onClick={() => confirmRemoveTabs(tabs)}>Remove All</div>
        </div>
        <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
      </div>
    </>
  );
};