import { useEffect } from "react";
import { browser } from "wxt/browser";
import type { TabV2 } from "../utils/data";
import { convertBytes, timeAgo } from "../utils/misc";
import {
  LastSnapshotDateItem,
  TabCountItem,
  TabItem,
  GroupItem,
  SortItem,
  SortReverseItem,
  GroupReverseItem,
  GranularityItem,
  LastSyncDateItem,
} from "../utils/storage";
import type { TGranularity, TGroup, TSort } from "../utils/storage";
import "./Dashboard.css";
import UngroupedTabView from "@/components/UngroupedTabView";
import SiteGroupTabView from "@/components/SiteGroupTabView";
import DateGroupTabView from "@/components/DateGroupTabView";
import ImportSnapshotModal from "@/components/ImportSnapshotModal";
import ImportListModal from "@/components/ImportListModal";
import ExportListModal from "@/components/ExportListModal";
import SelectInput from "@/components/SelectInput";
import NameGroupTabView from "@/components/NameGroupTabView";
import { Options } from "../utils/options";
import { SyncOp } from "../utils/sync";

export default () => {
  const [tabs, setTabs] = useState<TabV2[]>(TabItem.fallback);
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [group, setGroup] = useState<string>(GroupItem.fallback);
  const [groupReverse, setGroupReverse] = useState<boolean>(GroupReverseItem.fallback);
  const [sort, setSort] = useState<string>(SortItem.fallback);
  const [sortReverse, setSortReverse] = useState<boolean>(SortReverseItem.fallback);
  const [granularity, setGranularity] = useState<TGranularity>("seconds");
  const [loading, setLoading] = useState<boolean>(true);

  const [showImportSnapshot, setShowImportSnapshot] = useState<boolean>(false);
  const [showImportList, setShowImportList] = useState<boolean>(false);
  const [showExportList, setShowExportList] = useState<boolean>(false);

  const [lastSnapshotDate, setLastSnapshotDate] = useState<number>(LastSnapshotDateItem.fallback);
  const [addOpCount, setAddOpCount] = useState<number>(0);
  const [remOpCount, setRemOpCount] = useState<number>(0);

  const [syncEnabled, setSyncEnabled] = useState(Options.TAB_SYNC_ENABLED.item.fallback);
  const [bytesInUse, setBytesInUse] = useState<number>(0);
  const [lastSyncDate, setLastSyncDate] = useState<number>(LastSyncDateItem.fallback);
  const unwatchSyncEnabled = Options.TAB_SYNC_ENABLED.item.watch(v => setSyncEnabled(v));
  const unwatchLastSyncDate = LastSyncDateItem.watch(v => setLastSyncDate(v));

  const unwatchTabCount = TabCountItem.watch((v) => setTabCount(v));
  const unwatchTabs = TabItem.watch((v) => setTabs(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch((v) => setLastSnapshotDate(v));

  useEffect(() => {
    const setup = async () => {
      setTabs(await TabItem.getValue());
      setTabCount(await TabCountItem.getValue());

      setLastSnapshotDate(await LastSnapshotDateItem.getValue());

      setGroup(await GroupItem.getValue());
      setSort(await SortItem.getValue());
      setSortReverse(await SortReverseItem.getValue());
      setGroupReverse(await GroupReverseItem.getValue());
      setGranularity(await GranularityItem.getValue());

      setSyncEnabled(await Options.TAB_SYNC_ENABLED.item.getValue());
      setBytesInUse(await browser.storage.sync.getBytesInUse());
      setLastSyncDate(await LastSyncDateItem.getValue());

      const uuid = await Options.TAB_SYNC_UUID.item.getValue();
      const unwatchSyncQueue = storage.watch<SyncOp[]>(`local:sync_op-${uuid}`, (v) => {
        if (v === null) return;
        setAddOpCount(v.filter(a => a.kind === "add").length);
        setRemOpCount(v.filter(a => a.kind === "rem").length);
      });
      const syncQueue = await storage.getItem<SyncOp[]>(`local:sync_op-${uuid}`);
      if (syncQueue !== null) {
        setAddOpCount(syncQueue.filter(a => a.kind === "add").length);
        setRemOpCount(syncQueue.filter(a => a.kind === "rem").length);
      }

      setLoading(false);
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

  const changeGranularity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGranularity(e.target.value as TGranularity);
    await GranularityItem.setValue(e.target.value as TGranularity);
  };

  const SortLabel = ({ sort, name, checked }: { sort: TGroup | TSort, name: string, checked: boolean; }): JSX.Element => {
    switch (sort) {
      // Greyed out sort
      case "ungrouped":
        return (
          <label className="sort" htmlFor={name}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M20.84 22.73L11.11 13H3v-2h6.11l-3-3H3V6h1.11l-3-3l1.28-1.27l19.72 19.73zM15 11h-.8l.8.8zm6-3V6H9.2l2 2zM3 18h6v-2H3z"></path></svg>
          </label>
        );
      // Date sorter
      case "group_by_date":
      case "sort_by_date":
        if (checked) {
          return (
            <label className="sort" htmlFor={name}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M21 17h3l-4 4l-4-4h3V3h2zM8 16h3v-3H8zm5-11h-1V3h-2v2H6V3H4v2H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V7c0-1.11-.89-2-2-2M3 18v-7h10v7z"></path></svg>
            </label>
          );
        } else {
          return (
            <label className="sort" htmlFor={name}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h-3l4-4l4 4h-3v14h-2zM8 16h3v-3H8zm5-11h-1V3h-2v2H6V3H4v2H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V7c0-1.11-.89-2-2-2M3 18v-7h10v7z"></path></svg>
            </label>
          );
        };
      // A-Z sorter
      case "group_by_site":
      case "group_by_name":
      case "sort_by_name":
      case "sort_by_url":
        if (checked) {
          return (
            <label className="sort" htmlFor={name}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h3l-4-4l-4 4h3v14h2m-8-8v2l-3.33 4H11v2H5v-2l3.33-4H5v-2M9 3H7c-1.1 0-2 .9-2 2v6h2V9h2v2h2V5a2 2 0 0 0-2-2m0 4H7V5h2Z"></path></svg>
            </label>
          );
        } else {
          return (
            <label className="sort" htmlFor={name}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M19 17h3l-4 4l-4-4h3V3h2m-8 10v2l-3.33 4H11v2H5v-2l3.33-4H5v-2M9 3H7c-1.1 0-2 .9-2 2v6h2V9h2v2h2V5a2 2 0 0 0-2-2m0 4H7V5h2Z"></path></svg>
            </label>
          );
        };
    }
  };

  const storeSize = new Blob([JSON.stringify(tabs)]).size;

  const showVersions = async () => {
    const url = browser.runtime.getURL("/versions.html");
    browser.tabs.create({
      url: url,
      active: true,
    });
  };

  if (loading) {
    return (<></>);
  }

  return (
    <>
      <header>
        <div className="logo">TabFunnel</div>
        <div className="v-stack">
          <div className="count">{i18n.t("main.tabs", tabCount)} | {convertBytes(storeSize)}</div>
          <div className="info">{i18n.t("dashboard.info.lastSnapshot", [i18n.t("dashboard.info.snapshotDate", lastSnapshotDate, [timeAgo(lastSnapshotDate)])])}</div>
          <div className="info version" onClick={showVersions}>{i18n.t("main.version", [browser.runtime.getManifest().version])}</div>
        </div>
        {syncEnabled &&
          <div className="v-stack">
            <div className="info">Sync Size: {convertBytes(bytesInUse)} / {convertBytes(8192)}</div>
            <div className="info">Last Sync: {lastSyncDate === 0 ? "Never" : timeAgo(lastSyncDate)}</div>
            <div className="info">
              + {addOpCount} | - {remOpCount}
            </div>
          </div>
        }
        <div className="spacer"></div>
        <menu>
          <div onClick={() => setShowImportSnapshot(true)}>{i18n.t("dashboard.menu.importSnapshot")}</div>
          <div onClick={() => setShowImportList(true)}>{i18n.t("dashboard.menu.importList")}</div>
          <div onClick={() => setShowExportList(true)}>{i18n.t("dashboard.menu.exportList")}</div>
        </menu>
      </header>
      <div className="controls">
        <SelectInput onChange={changeGroup} value={group} name="group_by" id="group_by">
          <option value="ungrouped">{i18n.t("dashboard.controls.ungrouped")}</option>
          <option value="group_by_date">{i18n.t("dashboard.controls.groupByDate")}</option>
          <option value="group_by_site">{i18n.t("dashboard.controls.groupBySite")}</option>
          <option value="group_by_name">Group by Name</option>
        </SelectInput>
        {group === "group_by_date" &&
          <SelectInput onChange={changeGranularity} value={granularity} name="date_granularity" id="date_granularity">
            <option value="seconds">Second</option>
            <option value="minutes">Minute</option>
            <option value="hours">Hour</option>
            <option value="days">Day</option>
            <option value="weeks">Week</option>
            <option value="months">Month</option>
            <option value="years">Year</option>
          </SelectInput>
        }
        <SortLabel sort={group as TGroup | TSort} name="reverse_group" checked={groupReverse}></SortLabel>
        <input className="sort" disabled={group as TGroup === "ungrouped"} onChange={changeGroupReverse} checked={groupReverse} type="checkbox" name="reverse_group" id="reverse_group" />
        <span className="spacer"></span>
        <SelectInput onChange={changeSort} value={sort} name="sort_by" id="sort_by">
          <option value="sort_by_date">{i18n.t("dashboard.controls.sortByDate")}</option>
          <option value="sort_by_name">{i18n.t("dashboard.controls.sortByName")}</option>
          <option value="sort_by_url">{i18n.t("dashboard.controls.sortByURL")}</option>
        </SelectInput>
        <SortLabel sort={sort as TGroup | TSort} name="reverse_sort" checked={sortReverse}></SortLabel>
        <input className="sort" onChange={changeSortReverse} checked={sortReverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
      </div>
      <main>
        {group === "ungrouped" && <UngroupedTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></UngroupedTabView>}
        {group === "group_by_date" && <DateGroupTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs} granularity={granularity}></DateGroupTabView>}
        {group === "group_by_site" && <SiteGroupTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></SiteGroupTabView>}
        {group === "group_by_name" && <NameGroupTabView sort={sort as TSort} groupReverse={groupReverse} sortReverse={sortReverse} tabs={tabs}></NameGroupTabView>}
      </main>
      <ImportSnapshotModal openModal={showImportSnapshot} closeModal={() => setShowImportSnapshot(false)}></ImportSnapshotModal>
      <ImportListModal openModal={showImportList} closeModal={() => setShowImportList(false)}></ImportListModal>
      <ExportListModal openModal={showExportList} closeModal={() => setShowExportList(false)}></ExportListModal>
    </>
  );
};
