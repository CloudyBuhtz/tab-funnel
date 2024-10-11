import { CurrentThemeItem } from "@/entrypoints/utils/storage";
import KanagawaWave from "./themes/KanagawaWaveTheme";
import KanagawaLotus from "./themes/KanagawaLotusTheme";
import KanagawaDragon from "./themes/KanagawaDragonTheme";
import OneDark from "./themes/OneDarkTheme";
import OneLight from "./themes/OneLightTheme";
import GruvboxDark from "./themes/GruvboxDarkTheme";

type Theme = {
  id: string,
  name: string,
  style: {
    [key: string]: string;
  };
};

export default (): JSX.Element => {
  const unwatchCurrentTheme = CurrentThemeItem.watch((v) => switchTheme(getTheme(v)));

  useEffect(() => {
    const setup = async () => {
      switchTheme(getTheme(await CurrentThemeItem.getValue()));
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
