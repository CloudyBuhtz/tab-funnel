import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { funnelTabs, snapshotTabs, type TabV2 } from "../utils/data";
import { Options } from "../utils/options";
import {
  LastSnapshotDateItem,
  TabCountItem,
  TabItem,
} from "../utils/storage";
import "./Popup.css";
import { convertBytes, timeAgo } from "../utils/misc";
import { funnelLeftTabs, funnelOtherTabs, funnelRightTabs, funnelSelectedTabs, funnelThisTab } from "../utils/funnel";


const FunnelButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement>; }) => {
  const [showList, setShowList] = useState<boolean>(false);

  const arrowClickHandler = () => {
    setShowList(!showList);
  };

  return <>
    <div className="funnel-button">
      <button onClick={onClick}>{i18n.t("popup.funnelAllTabs")}</button>
      <button onClick={arrowClickHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" width="0.8rem" height="0.8rem" viewBox="0 0 24 24"><path fill="currentColor" d="M1 3h22L12 22"></path></svg>
      </button>
    </div>
    {showList &&
      <div className="funnel-list">
        <button onClick={async () => { funnelThisTab({}, (await browser.tabs.query({ active: true })).at(0)!); }}>This Tab</button>
        <button onClick={async () => { funnelOtherTabs({}, (await browser.tabs.query({ active: true })).at(0)!); }}>Other Tabs</button>
        <button onClick={async () => { funnelLeftTabs({}, (await browser.tabs.query({ active: true })).at(0)!); }}>Tabs to the Left</button>
        <button onClick={async () => { funnelRightTabs({}, (await browser.tabs.query({ active: true })).at(0)!); }}>Tabs to the Right</button>
        {import.meta.env.FIREFOX &&
          <button onClick={async () => { funnelSelectedTabs({}, (await browser.tabs.query({ active: true })).at(0)!); }}>Selected Tabs</button>
        }
      </div>
    }
  </>;
};

export default () => {
  const [tabCount, setTabCount] = useState(TabCountItem.fallback);
  const [lastSnapshotDate, setLastSnapshotDate] = useState(LastSnapshotDateItem.fallback);
  const [storeSize, setStoreSize] = useState(0);

  const funnelPinnedTabs = useRef(Options.FUNNEL_PINNED_TABS.item.fallback);
  const removeTabFunnelled = useRef(Options.REMOVE_TABS_FUNNELLED.item.fallback);
  const ignoreDuplicateTabs = useRef(Options.IGNORE_DUPLICATE_TABS.item.fallback);

  const unwatchTabCount = TabCountItem.watch(v => setTabCount(v));
  const unwatchLastSnapshotDate = LastSnapshotDateItem.watch(v => setLastSnapshotDate(v));

  useEffect(() => {
    const setup = async () => {
      setTabCount(await TabCountItem.getValue());
      setLastSnapshotDate(await LastSnapshotDateItem.getValue());
      // So so on this thing, kind of a waste
      const blob = new Blob([JSON.stringify(await TabItem.getValue())]);
      setStoreSize(blob.size);

      funnelPinnedTabs.current = await Options.FUNNEL_PINNED_TABS.item.getValue();
      removeTabFunnelled.current = await Options.REMOVE_TABS_FUNNELLED.item.getValue();
      ignoreDuplicateTabs.current = await Options.IGNORE_DUPLICATE_TABS.item.getValue();
    };
    setup();
  }, []);

  const funnelAllTabs = async () => {
    // Get current tabs
    const storedTabs = await TabItem.getValue();
    const hasTab = (url: string) => {
      return (storedTabs.find((val: TabV2) => {
        return val.url === url;
      })) ? true : false;
    };

    // Get tabs
    const tabs = await browser.tabs.query({
      currentWindow: true,
      url: "*://*/*",
      windowType: "normal"
    });

    funnelTabs(tabs);
  };

  const showList = async () => {
    const url = browser.runtime.getURL("/dashboard.html");
    const tabs = await browser.tabs.query({
      url: url,
      currentWindow: true,
    });

    if (tabs.length > 0) {
      browser.tabs.update(tabs[0].id, { active: true });
    } else {
      const newTab = browser.tabs.create({
        url: url,
      });
    }

    window.close();
  };

  const manualSnapshot = async () => {
    await snapshotTabs();
  };

  const showOptions = async () => {
    const url = browser.runtime.getURL("/options.html");
    const tabs = await browser.tabs.query({
      url: url,
      currentWindow: true,
    });

    if (tabs.length > 0) {
      browser.tabs.update(tabs[0].id, { active: true });
    } else {
      const newTab = browser.tabs.create({
        url: url,
      });
    }

    window.close();
  };

  const showVersions = async () => {
    const url = browser.runtime.getURL("/versions.html");
    browser.tabs.create({
      url: url,
      active: true,
    });
  };

  return (
    <main>
      <div className="info">{i18n.t("main.tabs", tabCount)} | {convertBytes(storeSize)}</div>
      <div className="info">{i18n.t("dashboard.info.lastSnapshot", [i18n.t("dashboard.info.snapshotDate", lastSnapshotDate, [timeAgo(lastSnapshotDate)])])}</div>
      <FunnelButton onClick={funnelAllTabs}></FunnelButton>
      <button onClick={showList}>{i18n.t("popup.showDashboard")}</button>
      <button onClick={manualSnapshot}>{i18n.t("popup.manualSnapshot")}</button>
      <div onClick={showVersions} className="info version">{i18n.t("main.version", [browser.runtime.getManifest().version])}</div>
      <div onClick={showOptions} className="cog">
        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"></path></svg>
      </div>
    </main>
  );
};
