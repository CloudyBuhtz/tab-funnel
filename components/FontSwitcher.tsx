import { Options } from "@/entrypoints/utils/options";

export default (): JSX.Element => {
  const unwatchFontOverride = Options.FONT_OVERRIDE.item.watch(v => setFont(v));

  const setFont = (val: string) => {
    document.body.style.fontFamily = val ?? undefined;
  };

  useEffect(() => {
    const setup = async () => {
      setFont(await Options.FONT_OVERRIDE.item.getValue());
    };
    setup();
  });
  return (<></>);
};
