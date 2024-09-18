import { ReactEventHandler, useEffect } from "react";
import type { Management } from "webextension-polyfill/namespaces/management";
import { browser, Tabs } from "wxt/browser";
import type { Tab } from "../utils/data";
import { storeTabs } from "../utils/data";
import { convertBytes } from "../utils/misc";
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
    };
    setup();
  }, []);

  const changeGroup = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    await GroupItem.setValue(e.target.value as TGroup)
  };

  const changeGroupReverse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupReverse(e.target.checked);
    await GroupReverseItem.setValue(e.target.checked);
  }

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
          <div className="info">Last Snapshot: {lastSnapshotDate === 0 ? "Never" : new Date(lastSnapshotDate).toLocaleString()}</div>
          <div className="info">Version {browser.runtime.getManifest().version}</div>
        </div>
        <div className="spacer"></div>
        <menu>
          <div onClick={() => setShowImportSnapshot(true)} className="importSnapshot">Import Snapshot</div>
          <div onClick={() => setShowImportList(true)} className="importList">Import List</div>
          <div onClick={() => setShowExportList(true)} className="exportList">Export List</div>
        </menu>
      </header>
      <div className="controls">
        <label htmlFor="group_by">Grouping:</label>
        <div className="select-wrapper">
          <select onChange={changeGroup} value={group} name="group_by" id="group_by">
            <option value="ungrouped">Ungrouped</option>
            <option value="group_by_date">Group by Date</option>
            <option value="group_by_site">Group by Site</option>
          </select>
        </div>
        <span className="spacer"></span>
        <label htmlFor="sort_by">Sorting:</label>
        <div className="select-wrapper">
          <select onChange={changeSort} value={sort} name="sort_by" id="sort_by">
            <option value="sort_by_date">Sort by Date</option>
            <option value="sort_by_name">Sort by Name</option>
            <option value="sort_by_url">Sort by URL</option>
          </select>
        </div>
        <span className="spacer"></span>
        <label htmlFor="reverse_sort">Reverse:</label>
        <input onChange={changeSortReverse} checked={sortReverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
      </div>
      <main>
        {group === "ungrouped" ? <UngroupedTabView sort={sort as TSort} reverse={sortReverse} tabs={tabs}></UngroupedTabView> : null}
        {group === "group_by_date" ? <DateGroupTabView sort={sort as TSort} reverse={sortReverse} tabs={tabs}></DateGroupTabView> : null}
        {group === "group_by_site" ? <SiteGroupTabView sort={sort as TSort} reverse={sortReverse} tabs={tabs}></SiteGroupTabView> : null}
      </main>
      <ImportSnapshotModal openModal={showImportSnapshot} closeModal={() => setShowImportSnapshot(false)}></ImportSnapshotModal>
      <ImportListModal openModal={showImportList} closeModal={() => setShowImportList(false)}></ImportListModal>
      <ExportListModal openModal={showExportList} closeModal={() => setShowExportList(false)}></ExportListModal>
    </>
  );
};

const ImportSnapshotModal = ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
  const [importActive, setImportActive] = useState(false);
  const [importInfo, setImportInfo] = useState<string>();
  const [importError, setImportError] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const overwriteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      setImportInfo(undefined);
    }
  }, [openModal]);

  const fileChange = async () => {
    const fileFound = (fileRef.current?.files?.length ?? 0) > 0;

    setImportActive(false);
    if (!fileFound) {
      return;
    }

    // Validate file
    try {
      const file = fileRef.current?.files![0];
      const json = await file?.text();
      const tabs: Tab[] = JSON.parse(json!) as Tab[];
      if (tabs.reduce === undefined) {
        throw new SyntaxError("Invalid JSON");
      }
      const valid: boolean = tabs.reduce((acc: boolean, tab: Tab) => {
        return acc && validateTab(tab);
      }, true);

      if (valid && tabs.length < 1) {
        throw new SyntaxError("No Tabs Found");
      }

      if (valid) {
        // Set tabs
        setImportInfo(`${tabs.length} Tabs Found`);
        setImportError(false);
        setImportActive(true);
      } else {
        throw new SyntaxError("Invalid JSON");
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setImportError(true);
        setImportInfo(`Error: ${err.message}`);
      }
    }
  };

  const validateTab = (tab: any): boolean => {
    return (
      tab !== undefined &&
      tab.title !== undefined &&
      tab.url !== undefined &&
      tab.date !== undefined &&
      tab.hash !== undefined
    );
  };

  const importTabs = async () => {
    const file = fileRef.current?.files![0];
    const json = await file?.text();
    const tabs: Tab[] = JSON.parse(json!) as Tab[];

    if (overwriteRef.current?.checked) {
      TabItem.setValue(tabs);
      TabCountItem.setValue(tabs.length);
    } else {
      storeTabs(tabs);
      TabCountItem.setValue((await TabCountItem.getValue()) + tabs.length);
    }
  };

  return (
    <dialog onCancel={closeModal} ref={dialogRef}>
      <div className="title">Import Snapshot</div>
      <input onChange={fileChange} ref={fileRef} accept="application/json" type="file" name="import_filename" id="import_filename" />
      <div className="buttons">
        <button disabled={!importActive} onClick={importTabs}>Import</button>
        <label htmlFor="import_overwrite">Overwrite:</label>
        <input ref={overwriteRef} type="checkbox" name="import_overwrite" id="import_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};

const ImportListModal = ({ openModal, closeModal }: { openModal: boolean, closeModal: ReactEventHandler }) => {
  const [importActive, setImportActive] = useState(false);
  const [importInfo, setImportInfo] = useState<string>();
  const [importError, setImportError] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLTextAreaElement>(null);
  const overwriteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      setImportInfo(undefined);
    }
  }, [openModal]);

  const textChange = () => {
    const lines = listRef.current?.value
      .split("\n")
      .filter((v) => v.match(/^http[s]*:\/\/.*/))
      .map((v) => v.split(" ")[0]);
    if (lines === undefined) return;

    const tabCount = lines[0] === "" ? 0 : lines?.length;

    if (tabCount! > 0) {
      setImportInfo(`${tabCount} Tabs`);
      setImportActive(true);
    } else {
      setImportInfo(undefined);
      setImportActive(false);
    }
  };

  const importTabs = async () => {
    const lines = listRef.current?.value
      .split("\n")
      .filter((v) => v.match(/^http[s]*:\/\/.*/))
      .map((v) => v.split(" ")[0]);
    setImportInfo(
      `Importing ${lines?.length} Tabs. This will take ~${lines?.length! / 2
      } seconds.`,
    );

    if (overwriteRef.current?.checked) {
      TabItem.setValue([]);
      TabCountItem.setValue(0);
    }

    let collectedTabs: Map<number, Tabs.Tab> = new Map();
    const tabListener = async (tabID: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
      if (changeInfo.status !== "complete") return;
      collectedTabs.set(tabID, tab);
      browser.tabs.remove([tab.id!]);

      if (collectedTabs.size === lines?.length) {
        const funnelDate = Date.now().toString();
        const tabArray = Array.from(collectedTabs);
        const tabsToFunnel: Tab[] = await Promise.all(
          tabArray.map(async ([id, tab]: [number, Tabs.Tab], index) => {
            return {
              title: tab.title!,
              url: tab.url!.toString(),
              date: funnelDate,
              hash: crypto.randomUUID(),
            } satisfies Tab;
          }),
        );

        storeTabs(tabsToFunnel);
        const tabCount = await TabCountItem.getValue();
        const newCount = tabCount + tabsToFunnel.length;
        await TabCountItem.setValue(newCount);

        browser.tabs.onUpdated.removeListener(tabListener);
      }
    };

    browser.tabs.onUpdated.addListener(tabListener);
    lines?.forEach((line: string, index: number) => {
      setTimeout(() => {
        browser.tabs.create({
          url: line,
          active: false,
        });
      }, index * 500);
    })!;
  };

  return (
    <dialog onCancel={closeModal} ref={dialogRef}>
      <div className="title">Import List</div>
      <textarea ref={listRef} onChange={textChange} rows={24}></textarea>
      <div className="buttons">
        <button disabled={!importActive} onClick={importTabs}>Import</button>
        <label htmlFor="import_overwrite">Overwrite:</label>
        <input ref={overwriteRef} type="checkbox" name="import_overwrite" id="import_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};

const ExportListModal = ({ openModal, closeModal }: { openModal: boolean, closeModal: ReactEventHandler }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadTabs = async () => {
      if (listRef.current === undefined || listRef.current === null) return;
      const tabs = await TabItem.getValue();
      listRef.current.value = tabs.map((t) => t.url).join("\n");
    };

    if (openModal) {
      loadTabs();
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [openModal]);

  return (
    <dialog onCancel={closeModal} ref={dialogRef}>
      <div className="title">Export List</div>
      <textarea ref={listRef} rows={24}></textarea>
      <div className="buttons">
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
    </dialog>
  );
};
