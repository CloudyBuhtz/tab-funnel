import CheckOption from "@/components/options/CheckOption";
import MultiOption from "@/components/options/MultiOption";
import TextOption from "@/components/options/TextOption";
import { snapshotTabs, type TabV2 } from "../utils/data";
import type {
  CheckOptionV2,
  MultiOptionV2,
  TextOptionV2,
  ButtonOptionV2,
  KeyOptionV2
} from "../utils/options";
import { OptionV2, Options, OptionsGroup } from "../utils/options";
import {
  LastSnapshotDateItem,
  LastSnapshotHashItem,
  TabCountItem,
  TabItem,
} from "../utils/storage";
import "./Options.css";
import { Fragment } from "react/jsx-runtime";
import ButtonOption from "@/components/options/ButtonOption";
import KeyOption from "@/components/options/KeyOption";

export default () => {
  const renderOptions = (options: OptionV2[]) => {
    return options.map((option) => {
      switch (option.type) {
        case "text":
          return <TextOption key={option.name} option={option as TextOptionV2}></TextOption>;
        case "check":
          return <CheckOption key={option.name} option={option as CheckOptionV2}></CheckOption>;
        case "multi":
          return <MultiOption key={option.name} option={option as MultiOptionV2}></MultiOption>;
        case "button":
          return <ButtonOption key={option.name} option={option as ButtonOptionV2}></ButtonOption>;
        case "key":
          return <KeyOption key={option.name} option={option as KeyOptionV2}></KeyOption>;
      };
    });
  };

  const resetOptions = async () => {
    Object.entries(Options).forEach(([k, v]) => {
      if (v.reset && v.item) {
        v.item.removeValue();
      }
    });
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

  const showOnboarding = () => {
    const url = browser.runtime.getURL("/onboarding.html");
    const newTab = browser.tabs.create({
      url: url,
      active: true,
    });
  };

  const showGithub = () => {
    const newTab = browser.tabs.create({
      url: "https://github.com/CloudyBuhtz/tab-funnel",
      active: true,
    });
  };

  return (
    <>
      <menu>
        <div onClick={showOnboarding}>{i18n.t("options.showOnboarding")}</div>
        <div onClick={showGithub}>{i18n.t("options.showGithub")}</div>
      </menu>
      <main>
        {OptionsGroup.map(group => {
          const optionList: OptionV2[] = [];
          group.options.forEach((o) => optionList.push(Options[o]));
          return (
            <Fragment key={group.key}>
              <div className="group">{group.name}</div>
              {renderOptions(optionList)}
            </Fragment>
          );
        })}
      </main>
    </>
  );
};
