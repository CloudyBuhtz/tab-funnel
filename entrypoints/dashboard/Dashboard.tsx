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
import UngroupedTabView from "@/components/UngroupedTabView";
import SiteGroupTabView from "@/components/SiteGroupTabView";
import DateGroupTabView from "@/components/DateGroupTabView";
import ImportSnapshotModal from "@/components/ImportSnapshotModal";
import ImportListModal from "@/components/ImportListModal";
import ExportListModal from "@/components/ExportListModal";
import SelectInput from "@/components/SelectInput";

const t = i18n.t;

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
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch((v) => setLastSnapshotDate(v));

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

  return (
    <>
      <header>
        <div className="logo">TabFunnel</div>
        <div className="v-stack">
          <div className="count">{t("main.tabs", tabCount)} | {convertBytes(storeSize)}</div>
          <div className="info">{t("dashboard.info.lastSnapshot")}: {lastSnapshotDate === 0 ? t("dashboard.info.never") : timeAgo(lastSnapshotDate)}</div>
          <div className="info">{t("dashboard.info.version", [browser.runtime.getManifest().version])}</div>
        </div>
        <div className="spacer"></div>
        <menu>
          <div onClick={() => setShowImportSnapshot(true)}>{t("dashboard.menu.importSnapshot")}</div>
          <div onClick={() => setShowImportList(true)}>{t("dashboard.menu.importList")}</div>
          <div onClick={() => setShowExportList(true)}>{t("dashboard.menu.exportList")}</div>
        </menu>
      </header>
      <div className="controls">
        <SelectInput onChange={changeGroup} value={group} name="group_by" id="group_by">
          <option value="ungrouped">{t("dashboard.controls.ungrouped")}</option>
          <option value="group_by_date">{t("dashboard.controls.groupByDate")}</option>
          <option value="group_by_site">{t("dashboard.controls.groupBySite")}</option>
        </SelectInput>
        <SortLabel sort={group as TGroup | TSort} name="reverse_group" checked={groupReverse}></SortLabel>
        <input className="sort" disabled={group as TGroup === "ungrouped"} onChange={changeGroupReverse} checked={groupReverse} type="checkbox" name="reverse_group" id="reverse_group" />
        <span className="spacer"></span>
        <SelectInput onChange={changeSort} value={sort} name="sort_by" id="sort_by">
          <option value="sort_by_date">{t("dashboard.controls.sortByDate")}</option>
          <option value="sort_by_name">{t("dashboard.controls.sortByName")}</option>
          <option value="sort_by_url">{t("dashboard.controls.sortByURL")}</option>
        </SelectInput>
        <SortLabel sort={sort as TGroup | TSort} name="reverse_sort" checked={sortReverse}></SortLabel>
        <input className="sort" onChange={changeSortReverse} checked={sortReverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
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
