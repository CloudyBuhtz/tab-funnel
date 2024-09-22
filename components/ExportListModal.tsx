import { ReactEventHandler, useEffect } from "react";
import { TabItem } from "../entrypoints/utils/storage";

export default ({ openModal, closeModal }: { openModal: boolean; closeModal: ReactEventHandler; }) => {
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
