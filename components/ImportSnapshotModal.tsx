import { ReactEventHandler, useEffect } from "react";
import { type TabV2, storeTabs } from "../entrypoints/utils/data";
import { TabItem, TabCountItem } from "../entrypoints/utils/storage";

export default ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
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
      const tabs: TabV2[] = JSON.parse(json!) as TabV2[];
      if (tabs.reduce === undefined) {
        throw new SyntaxError(i18n.t("dashboard.modal.validate.invalidJson"));
      }
      const valid: boolean = tabs.reduce((acc: boolean, tab: TabV2) => {
        return acc && validateTab(tab);
      }, true);

      if (valid && tabs.length < 1) {
        throw new SyntaxError(i18n.t("dashboard.modal.validate.tabsFound", 0));
      }

      if (valid) {
        // Set tabs
        setImportInfo(i18n.t("dashboard.modal.validate.tabsFound", tabs.length));
        setImportError(false);
        setImportActive(true);
      } else {
        throw new SyntaxError(i18n.t("dashboard.modal.validate.invalidJson"));
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setImportError(true);
        setImportInfo(`${i18n.t("dashboard.modal.validate.error")}: ${err.message}`);
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
    const tabs: TabV2[] = JSON.parse(json!) as TabV2[];

    if (overwriteRef.current?.checked) {
      await TabItem.setValue(tabs);
      TabCountItem.setValue(tabs.length);
    } else {
      storeTabs(tabs);
      TabCountItem.setValue((await TabCountItem.getValue()) + tabs.length);
    }
  };

  return (
    <dialog onCancel={closeModal} ref={dialogRef}>
      <div className="title">{i18n.t("dashboard.menu.importSnapshot")}</div>
      <input onChange={fileChange} ref={fileRef} accept="application/json" type="file" name="import_filename" id="import_filename" />
      <div className="buttons">
        <button disabled={!importActive} onClick={importTabs}>{i18n.t("dashboard.modal.import")}</button>
        <label>{i18n.t("dashboard.modal.overwrite")}:</label>
        <label className="checkbox" htmlFor="import_snapshot_overwrite">
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input ref={overwriteRef} type="checkbox" name="import_snapshot_overwrite" id="import_snapshot_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};
