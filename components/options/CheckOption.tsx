import type { CheckOptionV2 } from "@/entrypoints/utils/options";

interface CheckInputProps {
  option: CheckOptionV2;
}
export default ({ option }: CheckInputProps) => {
  const [value, setValue] = useState(option.item.fallback);

  const unwatch = option.item.watch((value) => {
    if (value === null) {
      return;
    }
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      const value = await option.item.getValue();
      if (value === null) { return; };
      setValue(value);
    };
    setup();
  }, []);

  const changeHandler = async () => {
    await option.item.setValue(!value);
  };

  return (
    <>
      <div className="option">
        <label>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <label className="checkbox" htmlFor={option.name}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input className="option" onChange={changeHandler} type="checkbox" checked={value} name={option.name} id={option.name} />
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
