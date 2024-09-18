import { useEffect } from "react";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser } from "wxt/browser";
import type { Tab } from "../utils/data";
import { convertBytes, timeAgo } from "../utils/misc";
import {
  LastSnapshotDateItem,
  TabCountItem,
  TabItem,
  GroupItem,
  SortItem,
  SortReverseItem,
  GroupReverseItem,
} from "../utils/storage";
import type { TGroup, TSort } from "../utils/storage";
import "./Dashboard.css";
import { UngroupedTabView } from "@/components/UngroupedTabView";
import { SiteGroupTabView } from "@/components/SiteGroupTabView";
import { DateGroupTabView } from "@/components/DateGroupTabView";
import { ImportSnapshotModal } from "@/components/ImportSnapshotModal";
import { ExportListModal } from "@/components/ExportListModal";
import { ImportListModal } from "@/components/ImportListModal";

export default () => {
  const [tabs, setTabs] = useState<Tab[]>(TabItem.fallback);
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [info, setInfo] = useState<Management.ExtensionInfo>();
  const [group, setGroup] = useState<string>(GroupItem.fallback);
  const [groupReverse, setGroupReverse] = useState<boolean>(GroupReverseItem.fallback);
  const [sort, setSort] = useState<string>(SortItem.fallback);
  const [sortReverse, setSortReverse] = useState<boolean>(SortReverseItem.fallback);

  const [showImportSnapshot, setShowImportSnapshot] = useState<boolean>(false);
  const [showImportList, setShowImportList] = useState<boolean>(false);
  const [showExportList, setShowExportList] = useState<boolean>(false);

  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);

  const unwatchTabCount = TabCountItem.watch((v) => setTabCount(v));
  const unwatchTabs = TabItem.watch((v) => setTabs(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch((v) =>
    setLastSnapshotDate(v),
  );

  useEffect(() => {
    const setup = async () => {
      setTabs(await TabItem.getValue());
      setTabCount(await TabCountItem.getValue());
      setInfo(await browser.management.getSelf());

      setLastSnapshotDate(await LastSnapshotDateItem.getValue());

      setGroup(await GroupItem.getValue());
      setSort(await SortItem.getValue());
      setSortReverse(await SortReverseItem.getValue());
      setGroupReverse(await GroupReverseItem.getValue());
    };
    setup();
  }, []);

  const changeGroup = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    await GroupItem.setValue(e.target.value as TGroup);
  };

  const changeGroupReverse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupReverse(e.target.checked);
    await GroupReverseItem.setValue(e.target.checked);
  };

  const changeSort = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    await SortItem.setValue(e.target.value as TSort);
  };

  const changeSortReverse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortReverse(e.target.checked);
    await SortReverseItem.setValue(e.target.checked);
  };

  const storeSize = new Blob([JSON.stringify(tabs)]).size;

  return (
    <>
      <header>
        <div className="logo">TabFunnel</div>
        <div className="v-stack">
          <div className="count">{tabCount} Tabs | {convertBytes(storeSize)}</div>
          <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : timeAgo(lastSnapshotDate)}</div>
          <div className="info">Version {browser.runtime.getManifest().version}</div>
        </div>
        <div className="spacer"></div>
        <menu>
          <div onClick={() => setShowImportSnapshot(true)}>Import Snapshot</div>
          <div onClick={() => setShowImportList(true)}>Import List</div>
          <div onClick={() => setShowExportList(true)}>Export List</div>
        </menu>
      </header>
      <div className="controls">
        <div className="select-wrapper">
          <select onChange={changeGroup} value={group} name="group_by" id="group_by">
            <option value="ungrouped">Ungrouped</option>
            <option value="group_by_date">Group by Date</option>
            <option value="group_by_site">Group by Site</option>
          </select>
        </div>
        <input className="direction" onChange={changeGroupReverse} checked={groupReverse} type="checkbox" name="reverse_group" id="reverse_group" />
        <span className="spacer"></span>
        <div className="select-wrapper">
          <select onChange={changeSort} value={sort} name="sort_by" id="sort_by">
            <option value="sort_by_date">Sort by Date</option>
            <option value="sort_by_name">Sort by Name</option>
            <option value="sort_by_url">Sort by URL</option>
          </select>
        </div>
        <input className="direction" onChange={changeSortReverse} checked={sortReverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
      </div>
      <main>
        {group === "ungrouped" ? <UngroupedTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></UngroupedTabView> : null}
        {group === "group_by_date" ? <DateGroupTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></DateGroupTabView> : null}
        {group === "group_by_site" ? <SiteGroupTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></SiteGroupTabView> : null}
      </main>
      <ImportSnapshotModal openModal={showImportSnapshot} closeModal={() => setShowImportSnapshot(false)}></ImportSnapshotModal>
      <ImportListModal openModal={showImportList} closeModal={() => setShowImportList(false)}></ImportListModal>
      <ExportListModal openModal={showExportList} closeModal={() => setShowExportList(false)}></ExportListModal>
    </>
  );
};
