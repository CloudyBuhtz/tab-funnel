import CheckOption from "@/components/CheckOption";
import MultiOption from "@/components/MultiOption";
import TextOption from "@/components/TextOption";
import { snapshotTabs, type TabV2 } from "../utils/data";
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
          <button onClick={removeDuplicates}>{i18n.t("options.danger.removeAllDuplicates.button")}</button>
          <div className="description">
            <div>{i18n.t("options.danger.removeAllDuplicates.description.A")}</div>
            <div>{i18n.t("options.danger.removeAllDuplicates.description.B")}</div>
          </div>
          <button onClick={clearTabs}>{i18n.t("options.danger.clearAllTabs.button")}</button>
          <div className="description">
            <div>{i18n.t("options.danger.clearAllTabs.description.A")}</div>
            <div>{i18n.t("options.danger.clearAllTabs.description.B")}</div>
          </div>
          <button onClick={clearSnapshotDate}>{i18n.t("options.danger.clearSnapshotDate.button")}</button>
          <div className="description">
            <div>{i18n.t("options.danger.clearSnapshotDate.description.A")}</div>
          </div>
        </div>
      );
    };
  };

  const clearTabs = async () => {
    if (!confirm(i18n.t("options.danger.clearAllTabs.confirm"))) return;
    await snapshotTabs();
    await TabCountItem.setValue(0);
    await TabItem.setValue([]);
  };

  const clearSnapshotDate = async () => {
    if (!confirm(i18n.t("options.danger.clearSnapshotDate.confirm"))) return;
    await LastSnapshotHashItem.setValue(LastSnapshotHashItem.fallback);
    await LastSnapshotDateItem.setValue(0);
  };

  const removeDuplicates = async () => {
    if (!confirm(i18n.t("options.danger.removeAllDuplicates.confirm"))) return;
    await snapshotTabs();

    const tabs = await TabItem.getValue();
    const tabMap = new Map<string, TabV2>();
    tabs.forEach((tab: TabV2) => {
      tabMap.set(tab.url, tab);
    });
    const filteredTabs: TabV2[] = [];
    tabMap.forEach((tab: TabV2, url: string) => {
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
        <div onClick={showOnboarding}>{i18n.t("options.showOnboarding")}</div>
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
        <div className="option danger" onClick={dangerHandler}>{i18n.t("options.danger.show")}</div>
        {renderDanger(showDanger)}
      </main>
    </>
  );
};
