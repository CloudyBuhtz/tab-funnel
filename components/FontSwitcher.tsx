import { FontOverrideItem } from "@/entrypoints/utils/storage";

export default (): JSX.Element => {
  const unwatchFontOverride = FontOverrideItem.watch(v => setFont(v));

  const setFont = (val: string) => {
    document.body.style.fontFamily = val ?? undefined;
  };

  useEffect(() => {
    const setup = async () => {
      setFont(await FontOverrideItem.getValue());
    };
    setup();
  });
  return (<></>);
};
