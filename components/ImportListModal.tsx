import { ReactEventHandler, useEffect } from "react";
import { Tabs, browser } from "wxt/browser";
import { type TabV2, storeTabs } from "../entrypoints/utils/data";
import { TabItem, TabCountItem } from "../entrypoints/utils/storage";

export default ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
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
      setImportInfo(i18n.t("main.tabs", tabCount));
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
    setImportInfo(i18n.t("dashboard.modal.importListInfo", [lines?.length!, lines?.length! / 2]));

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
        const tabsToFunnel: TabV2[] = await Promise.all(
          tabArray.map(async ([id, tab]: [number, Tabs.Tab], index) => {
            return {
              title: tab.title!,
              url: tab.url!.toString(),
              date: funnelDate,
              hash: crypto.randomUUID(),
              pinned: false
            } satisfies TabV2;
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
      <div className="title">{i18n.t("dashboard.menu.importList")}</div>
      <textarea ref={listRef} onChange={textChange} rows={24}></textarea>
      <div className="buttons">
        <button disabled={!importActive} onClick={importTabs}>{i18n.t("dashboard.modal.import")}</button>
        <label>{i18n.t("dashboard.modal.overwrite")}:</label>
        <label className="checkbox" htmlFor="import_list_overwrite">
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input ref={overwriteRef} type="checkbox" name="import_list_overwrite" id="import_list_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>{i18n.t("dashboard.modal.close")}</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};
