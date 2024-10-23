import ButtonOption from "@/components/options/ButtonOption";
import CheckOption from "@/components/options/CheckOption";
import KeyOption from "@/components/options/KeyOption";
import MultiOption from "@/components/options/MultiOption";
import TextOption from "@/components/options/TextOption";
import { Fragment } from "react/jsx-runtime";
import type {
  TButtonOption,
  TCheckOption,
  TKeyOption,
  TMultiOption,
  TTextOption
} from "../utils/options";
import { TOption, Options, OptionsGroup } from "../utils/options";
import "./Options.css";

export default () => {
  const renderOptions = (options: TOption[]) => {
    return options.map((option) => {
      switch (option.type) {
        case "text":
          return <TextOption key={option.name} option={option as TTextOption}></TextOption>;
        case "check":
          return <CheckOption key={option.name} option={option as TCheckOption}></CheckOption>;
        case "multi":
          return <MultiOption key={option.name} option={option as TMultiOption}></MultiOption>;
        case "button":
          return <ButtonOption key={option.name} option={option as TButtonOption}></ButtonOption>;
        case "key":
          return <KeyOption key={option.name} option={option as TKeyOption}></KeyOption>;
      };
    });
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
          const optionList: TOption[] = [];
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
