import { ReactEventHandler, useEffect } from "react";
import { Tabs, browser } from "wxt/browser";
import { type Tab, storeTabs } from "../entrypoints/utils/data";
import { TabItem, TabCountItem } from "../entrypoints/utils/storage";

export const ImportListModal = ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
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
    setImportInfo(`Importing ${lines?.length} Tabs. This will take ~${(lines?.length)! / 2} seconds.`);

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
          })
        );

        storeTabs(tabsToFunnel);
        const tabCount = await TabCountItem.getValue();
        const newCount = tabCount + tabsToFunnel.length;
        await TabCountItem.setValue(newCount);

        browser.tabs.onUpdated.removeListener(tabListener);
      }
    };

    browser.tabs.onUpdated.addListener(tabListener);
    (lines?.forEach((line: string, index: number) => {
      setTimeout(() => {
        browser.tabs.create({
          url: line,
          active: false,
        });
      }, index * 500);
    }))!;
  };

  return (
    <dialog onCancel={closeModal} ref={dialogRef}>
      <div className="title">Import List</div>
      <textarea ref={listRef} onChange={textChange} rows={24}></textarea>
      <div className="buttons">
        <button disabled={!importActive} onClick={importTabs}>Import</button>
        <label>Overwrite:</label>
        <label className="checkbox" htmlFor="import_list_overwrite">
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input className="test" ref={overwriteRef} type="checkbox" name="import_list_overwrite" id="import_list_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};
