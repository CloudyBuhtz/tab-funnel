import { CurrentThemeItem } from "@/entrypoints/utils/storage";
import BasicTheme from "./themes/BasicTheme";
import KanagawaTheme from "./themes/KanagawaTheme";

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
      case "basic":
        return BasicTheme;
      case "kanagawa":
        return KanagawaTheme;
      default:
        return KanagawaTheme;
    }
  };

  const switchTheme = (theme: Theme): void => {
    Object.entries(theme.style).forEach(([key, val]) => {
      document.body.style.setProperty(key, val);
    });
  };

  return (<></>);
};
