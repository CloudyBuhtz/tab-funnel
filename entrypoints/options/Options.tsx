import { CheckInput, MultiInput, TextInput } from "@/components/option";
import { Option, Options } from "../utils/options";
import type { CheckOption, MultiOption, TextOption } from "../utils/options";
import "./Options.css";
import { LastSnapshotDateItem, TabCountItem, TabItem } from "../utils/storage";
import { snapshotTabs, Tab } from "../utils/data";

export default () => {
  const [showDanger, setShowDanger] = useState(false);

  const renderInputs = (options: [string, Option][]) => {
    return options.map(([_, option]) => {
      switch (option.type) {
        case "text":
          return <TextInput key={option.name} option={option as TextOption}></TextInput>
        case "check":
          return <CheckInput key={option.name} option={option as CheckOption}></CheckInput>
        case "multi":
          return <MultiInput key={option.name} option={option as MultiOption}></MultiInput>
      };
    });
  };

  const renderDanger = (danger: boolean) => {
    if (!danger) { return (<></>) } else {
      return (
        <div className="danger-zone">
          <button onClick={removeDuplicates}>Remove ALL Duplicates</button>
          <div className="description fix-padding">Clicking this remove all duplicate Tabs based on their URL.<br></br>Warning: This is a permanent change to the data.</div>
          <button onClick={clearTabs}>Clear ALL Tabs</button>
          <div className="description fix-padding">Clicking this will remove all stored tabs, a backup will be made just before in case you didn't mean it / want to undo this action.<br></br>Warning: This is a permanent change to the data.</div>
          <button onClick={clearSnapshotDate}>Clear Snapshot Date</button>
          <div className="description fix-padding">Clicking this will reset the date of the last snapshot to Never, making the next timed snapshot happen the next time it's checked.</div>
        </div>
      )
    }
  };

  // Also make backup just before deleting
  const clearTabs = async () => {
    await snapshotTabs();
    await TabCountItem.setValue(0);
    await TabItem.setValue([]);
  };

  const clearSnapshotDate = async () => {
    await LastSnapshotDateItem.setValue(0);
  };

  const removeDuplicates = async () => {
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

  return (
    <main>
      {renderInputs(Object.entries(Options))}
      <div className="option pointer center" onClick={dangerHandler}>-- Show / Hide Dangerous Options --</div>
      {renderDanger(showDanger)}
    </main>
  );
};
