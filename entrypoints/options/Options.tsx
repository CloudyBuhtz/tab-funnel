import CheckOption from "@/components/CheckOption";
import MultiOption from "@/components/MultiOption";
import TextOption from "@/components/TextOption";
import { snapshotTabs, Tab } from "../utils/data";
import type {
  CheckOption as CheckOptionType,
  MultiOption as MultiOptionType,
  TextOption as TextOptionType
} from "../utils/options";
import { Option, Options, OptionsGroup } from "../utils/options";
import {
  LastSnapshotDateItem,
  LastSnapshotHashItem,
  TabCountItem,
  TabItem,
} from "../utils/storage";
import "./Options.css";
import { Fragment } from "react/jsx-runtime";

export default () => {
  const [showDanger, setShowDanger] = useState(false);

  const renderOptions = (options: Option[]) => {
    return options.map((option) => {
      switch (option.type) {
        case "text":
          return <TextOption key={option.name} option={option as TextOptionType}></TextOption>;
        case "check":
          return <CheckOption key={option.name} option={option as CheckOptionType}></CheckOption>;
        case "multi":
          return <MultiOption key={option.name} option={option as MultiOptionType}></MultiOption>;
      };
    });
  };

  const renderDanger = (danger: boolean) => {
    if (!danger) { return (<></>); } else {
      return (
        <div className="danger-zone">
          <button onClick={removeDuplicates}>Remove ALL Duplicates</button>
          <div className="description fix-padding">
            <div>Clicking this remove all duplicate Tabs based on their URL.</div>
            <div>Warning: This is a permanent change to the data.</div>
          </div>
          <button onClick={clearTabs}>Clear ALL Tabs</button>
          <div className="description fix-padding">
            <div>Clicking this will remove all stored tabs, a backup will be made just before in case you didn't mean it / want to undo this action.</div>
            <div>Warning: This is a permanent change to the data.</div>
          </div>
          <button onClick={clearSnapshotDate}>Clear Snapshot Date</button>
          <div className="description fix-padding">
            <div>Clicking this will reset the date of the last snapshot to Never, making the next timed snapshot happen the next time it's checked.</div>
          </div>
        </div>
      );
    };
  };

  const clearTabs = async () => {
    if (!confirm("Are you sure you want to remove all Tabs, a Snapshot will be made")) return;
    await snapshotTabs();
    await TabCountItem.setValue(0);
    await TabItem.setValue([]);
  };

  const clearSnapshotDate = async () => {
    if (!confirm("Are you sure you want to clear the last Snapshot date?")) return;
    await LastSnapshotHashItem.setValue(LastSnapshotHashItem.fallback);
    await LastSnapshotDateItem.setValue(0);
  };

  const removeDuplicates = async () => {
    if (!confirm("Are you sure you want to remove all duplicate Tabs, a Snapshot will be made")) return;
    await snapshotTabs();

    const tabs = await TabItem.getValue();
    const tabMap = new Map<string, Tab>();
    tabs.forEach((tab: Tab) => {
      tabMap.set(tab.url, tab);
    });
    const filteredTabs: Tab[] = [];
    tabMap.forEach((tab: Tab, url: string) => {
      filteredTabs.push(tab);
    });

    TabItem.setValue(filteredTabs);
    TabCountItem.setValue(filteredTabs.length);
  };

  const dangerHandler = async () => {
    setShowDanger(!showDanger);
  };

  const showOnboarding = () => {
    const url = browser.runtime.getURL("/onboarding.html");
    const newTab = browser.tabs.create({
      url: url,
      active: true
    });
  };

  return (
    <>
      <menu>
        <div onClick={showOnboarding}>Show Welcome Page</div>
      </menu>
      <main>
        {OptionsGroup.map(group => {
          const optionList: Option[] = [];
          group.options.forEach((o) => optionList.push(Options[o]));
          return (
            <Fragment key={group.key}>
              <div className="group">{group.name}</div>
              {renderOptions(optionList)}
            </Fragment>
          );
        })}
        <div className="option pointer center" onClick={dangerHandler}>-- Show / Hide Dangerous Options --</div>
        {renderDanger(showDanger)}
      </main>
    </>
  );
};
