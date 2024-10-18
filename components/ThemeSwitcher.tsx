import { Options } from "@/entrypoints/utils/options";

import KanagawaWave from "./themes/KanagawaWave";
import KanagawaLotus from "./themes/KanagawaLotus";
import KanagawaDragon from "./themes/KanagawaDragon";
import OneDark from "./themes/OneDark";
import OneLight from "./themes/OneLight";
import GruvboxDark from "./themes/GruvboxDark";
import CatpuccinLatte from "./themes/CatpuccinLatte";
import CatpuccinFrappe from "./themes/CatpuccinFrappe";
import CatpuccinMacchiato from "./themes/CatpuccinMacchiato";
import CatpuccinMocha from "./themes/CatpuccinMocha";
import TokyoNightDay from "./themes/TokyoNightDay";
import TokyoNightMoon from "./themes/TokyoNightMoon";
import TokyoNightNight from "./themes/TokyoNightNight";
import TokyoNightStorm from "./themes/TokyoNightStorm";
import Dracula from "./themes/Dracula";
import Nord from "./themes/Nord";
import GruvboxLight from "./themes/GruvboxLight";

type Theme = {
  id: string,
  name: string,
  style: {
    [key: string]: string;
  };
};

export default (): JSX.Element => {
  const unwatchCurrentTheme = Options.CURRENT_THEME.item.watch((v) => switchTheme(getTheme(v)));

  useEffect(() => {
    const setup = async () => {
      switchTheme(getTheme(await Options.CURRENT_THEME.item.getValue()));
    };
    setup();
  }, []);

  const getTheme = (theme: string): Theme => {
    switch (theme) {
      case "kanagawa_wave":
        return KanagawaWave;
      case "kanagawa_dragon":
        return KanagawaDragon;
      case "kanagawa_lotus":
        return KanagawaLotus;
      case "one_dark":
        return OneDark;
      case "one_light":
        return OneLight;
      case "gruvbox_dark":
        return GruvboxDark;
      case "gruvbox_light":
        return GruvboxLight;
      case "catpuccin_latte":
        return CatpuccinLatte;
      case "catpuccin_frappe":
        return CatpuccinFrappe;
      case "catpuccin_macchiato":
        return CatpuccinMacchiato;
      case "catpuccin_mocha":
        return CatpuccinMocha;
      case "tokyonight_day":
        return TokyoNightDay;
      case "tokyonight_moon":
        return TokyoNightMoon;
      case "tokyonight_night":
        return TokyoNightNight;
      case "tokyonight_storm":
        return TokyoNightStorm;
      case "dracula":
        return Dracula;
      case "nord":
        return Nord;
      default:
        return KanagawaWave;
    }
  };

  const switchTheme = (theme: Theme): void => {
    Object.entries(theme.style).forEach(([key, val]) => {
      document.body.style.setProperty(key, val);
    });
  };

  return (<></>);
};
