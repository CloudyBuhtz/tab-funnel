import { ReactEventHandler, useEffect } from "react";
import type { Management } from "webextension-polyfill/namespaces/management";
import type { Tab } from "../utils/data";
import { removeTab, storeTabs } from "../utils/data";
import {
  LastSnapshotDateItem,
  RemoveTabsRestoredItem,
  SwitchTabRestoredItem,
  TabCountItem,
  TabItem
} from "../utils/storage";
import "./Dashboard.css";
import { Tabs, WebNavigation } from "wxt/browser";
import { browser } from "wxt/browser";
import { convertBytes, hashString } from "../utils/misc";

function getFavIconURL(url: string) {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];
  return "https://www.google.com/s2/favicons?domain=" + domain;
};

type TGroup = "ungrouped" | "group_by_date" | "group_by_site";
const GroupItem = storage.defineItem<TGroup>("local:dashboard_group", {
  fallback: "ungrouped",
});

type TSort = "sort_by_date" | "sort_by_name" | "sort_by_url";
const SortItem = storage.defineItem<TSort>("local:dashboard_sort", {
  fallback: "sort_by_date",
});

const ReverseItem = storage.defineItem<boolean>("local:dashboard_reverse", {
  fallback: false,
});

const openTabs = async (opTabs: Tab[]) => {
  const switchTabRestored = await SwitchTabRestoredItem.getValue();
  const removeTabsRestored = await RemoveTabsRestoredItem.getValue();
  opTabs.forEach((tab) => {
    browser.tabs.create({
      url: tab.url,
      active: switchTabRestored
    });
  });

  // Optionally remove tab
  if (removeTabsRestored) {
    removeTab(opTabs);
  };
};

export default () => {
  const [tabs, setTabs] = useState<Tab[]>(TabItem.fallback);
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [info, setInfo] = useState<Management.ExtensionInfo>();
  const [group, setGroup] = useState<string>(GroupItem.fallback);
  const [sort, setSort] = useState<string>(SortItem.fallback);
  const [reverse, setReverse] = useState<boolean>(ReverseItem.fallback);

  const [showImportSnapshot, setShowImportSnapshot] = useState<boolean>(false);
  const [showImportList, setShowImportList] = useState<boolean>(false);
  const [showExportList, setShowExportList] = useState<boolean>(false);

  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);

  const unwatchTabCount = TabCountItem.watch(v => setTabCount(v));
  const unwatchTabs = TabItem.watch(v => setTabs(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch(v => setLastSnapshotDate(v))

  useEffect(() => {
    const setup = async () => {
      setTabs(await TabItem.getValue());
      setTabCount(await TabCountItem.getValue());
      setInfo(await browser.management.getSelf());

      setLastSnapshotDate(await LastSnapshotDateItem.getValue());

      setGroup(await GroupItem.getValue());
      setSort(await SortItem.getValue());
      setReverse(await ReverseItem.getValue());
    };
    setup();
  }, []);

  const changeGroup = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    await GroupItem.setValue(e.target.value as TGroup);
  };

  const changeSort = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    await SortItem.setValue(e.target.value as TSort);
  };

  const reverseChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setReverse(e.target.checked);
    await ReverseItem.setValue(e.target.checked);
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
        <input onChange={reverseChange} checked={reverse} type="checkbox" name="reverse_sort" id="reverse_sort" />
      </div>
      <main>
        {group === "ungrouped" ? <UngroupedView sort={sort as TSort} reverse={reverse} tabs={tabs}></UngroupedView> : null}
        {group === "group_by_date" ? <DateGroupView sort={sort as TSort} reverse={reverse} tabs={tabs}></DateGroupView> : null}
        {group === "group_by_site" ? <SiteGroupView sort={sort as TSort} reverse={reverse} tabs={tabs}></SiteGroupView> : null}
      </main>
      <ImportSnapshotModal openModal={showImportSnapshot} closeModal={() => setShowImportSnapshot(false)}></ImportSnapshotModal>
      <ImportListModal openModal={showImportList} closeModal={() => setShowImportList(false)}></ImportListModal>
      <ExportListModal openModal={showExportList} closeModal={() => setShowExportList(false)}></ExportListModal>
    </>
  );
};

type SortType = "sort_by_date" | "sort_by_name" | "sort_by_url";
type TabViewProps = {
  tabs: Tab[],
  sort: TSort;
  reverse: boolean;
};

const SortedTabView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  let sortedTabs: Tab[] = tabs.slice(0);

  switch (sort) {
    case "sort_by_date":
      sortedTabs.sort((a, b) => { return parseInt(a.date) - parseInt(b.date) });
      break;
    case "sort_by_name":
      sortedTabs.sort((a, b) => { return a.title.localeCompare(b.title) });
      break;
    case "sort_by_url":
      sortedTabs.sort((a, b) => { return a.url.localeCompare(b.url) });
      break;
  }

  if (reverse) {
    sortedTabs.reverse()
  }

  return (
    <>{sortedTabs.map((tab: Tab) => (
      <div key={tab.hash} className="tab">
        <div onClick={() => removeTab([tab])} className="close">X</div>
        <img className="icon" src={getFavIconURL(tab.url)} alt={tab.title} />
        <span onClick={() => openTabs([tab])} className="title">{tab.title}</span>
      </div>
    ))}
    </>
  )
};

const UngroupedView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  return (
    <>
      <div className="group">
        <div className="info">
          <div className="name">All Tabs</div>
          <div className="spacer"></div>
          <div className="openAll" onClick={() => openTabs(tabs)}>Open Group</div>
          <div className="removeAll" onClick={() => removeTab(tabs)}>Remove Group</div>
        </div>
        <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
      </div>
    </>
  )
};

const SiteGroupView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;

  const groupedTabs = Object.entries(tabs.reduce((ob: { [key: string]: Tab[] }, item) => {
    const matches = item.url.match(regex)!;
    const domain: string = matches && matches[1];
    return { ...ob, [domain]: [...ob[domain] ?? [], item] }
  }, {})).sort(([a, _]: [string, Tab[]], [b, __]: [string, Tab[]]) => {
    return a.replace("www.", "").localeCompare(b.replace("www.", ""));
  });

  return (
    <>
      {groupedTabs.map(([domain, tabs]: [string, Tab[]]) => (
        <div className="group" key={domain}>
          <div className="info">
            <div className="name">{domain}</div>
            <div className="spacer"></div>
            <div className="openAll" onClick={() => openTabs(tabs)}>Open Group</div>
            <div className="removeAll" onClick={() => removeTab(tabs)}>Remove Group</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};

const DateGroupView = ({ tabs, sort, reverse }: TabViewProps): JSX.Element => {
  const groupedTabs = tabs.reduce((ob: { [key: string]: Tab[] }, item) => ({ ...ob, [item.date]: [...ob[item.date] ?? [], item] }), {});
  return (
    <>
      {Object.entries(groupedTabs).reverse().map(([date, tabs]: [string, Tab[]]) => (
        <div className="group" key={date}>
          <div className="info">
            <div className="name">{new Date(parseInt(date)).toUTCString()}</div>
            <div className="spacer"></div>
            <div className="openAll" onClick={() => openTabs(tabs)}>Open Group</div>
            <div className="removeAll" onClick={() => removeTab(tabs)}>Remove Group</div>
          </div>
          <SortedTabView tabs={tabs} sort={sort} reverse={reverse}></SortedTabView>
        </div>
      ))}
    </>
  );
};

type ModalProps = {
  openModal: boolean,
  closeModal: ReactEventHandler,
}
const ImportSnapshotModal = ({ openModal, closeModal }: ModalProps) => {
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
      return
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
        return acc && validateTab(tab)
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
    return tab !== undefined &&
      tab.title !== undefined &&
      tab.url !== undefined &&
      tab.date !== undefined &&
      tab.hash !== undefined
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
      TabCountItem.setValue(await TabCountItem.getValue() + tabs.length);
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

const ImportListModal = ({ openModal, closeModal }: ModalProps) => {
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
    const lines = listRef.current?.value.split("\n").filter(v => v.match(/^http[s]*:\/\/.*/));
    if (lines === undefined) return

    const tabCount = lines[0] === '' ? 0 : lines?.length;

    console.log(lines);

    if (tabCount! > 0) {
      setImportInfo(`${tabCount} Tabs`);
      setImportActive(true);
    } else {
      setImportInfo(undefined);
      setImportActive(false);
    }
  };

  const importTabs = async () => {
    const lines = listRef.current?.value.split("\n").filter(v => v.match(/^http[s]*:\/\/.*/));
    setImportInfo(`Importing ${lines?.length} Tabs. This may take some time`);

    if (overwriteRef.current?.checked) {
      TabItem.setValue([]);
      TabCountItem.setValue(0);
    }

    let collectedTabs: Map<number, Tabs.Tab> = new Map();
    const tabListener = async (tabID: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
      if (changeInfo.status !== "complete") return;
      collectedTabs.set(tabID, tab);

      if (collectedTabs.size === lines?.length) {
        const funnelDate = Date.now().toString();
        const tabArray = Array.from(collectedTabs);
        const tabsToFunnel: Tab[] = await Promise.all(tabArray.map(async ([id, tab]: [number, Tabs.Tab], index) => {
          const tabHash = await hashString(`${funnelDate}/${index.toString()}`);
          return {
            title: tab.title!,
            url: tab.url!.toString(),
            date: funnelDate,
            hash: tabHash
          } satisfies Tab;
        }));

        storeTabs(tabsToFunnel);
        const tabCount = await TabCountItem.getValue();
        const newCount = tabCount + tabsToFunnel.length;
        await TabCountItem.setValue(newCount);

        browser.tabs.remove(
          tabArray.map(([_, tab]) => {
            return tab.id!
          })
        );

        browser.tabs.onUpdated.removeListener(tabListener);
      }
    };

    browser.tabs.onUpdated.addListener(tabListener);
    lines?.map((line: string) => {
      return browser.tabs.create({
        url: line,
        active: false
      });
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

const ExportListModal = ({ openModal, closeModal }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadTabs = async () => {
      if (listRef.current === undefined || listRef.current === null) return
      const tabs = await TabItem.getValue();
      listRef.current.value = tabs.map(t => t.url).join("\n");
    }

    if (openModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      loadTabs();
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
