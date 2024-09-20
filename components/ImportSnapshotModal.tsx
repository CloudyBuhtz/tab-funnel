import { ReactEventHandler, useEffect } from "react";
import { type Tab, storeTabs } from "../entrypoints/utils/data";
import { TabItem, TabCountItem } from "../entrypoints/utils/storage";

export const ImportSnapshotModal = ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
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
        <label htmlFor="import_snapshot_overwrite">Overwrite:</label>
        <input ref={overwriteRef} type="checkbox" name="import_snapshot_overwrite" id="import_snapshot_overwrite" />
        <div className="spacer"></div>
        <button onClick={closeModal}>Close</button>
      </div>
      {importInfo && <div className={"info" + (importError ? " error" : "")}>{importInfo}</div>}
    </dialog>
  );
};
