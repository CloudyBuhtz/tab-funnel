import type { TCheckOption } from "@/entrypoints/utils/options";

interface CheckInputProps {
  option: TCheckOption;
}
export default ({ option }: CheckInputProps) => {
  const [value, setValue] = useState(option.item.fallback);

  const unwatch = option.item.watch((value) => {
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      setValue(await option.item.getValue());
    };
    setup();
  }, []);

  const changeHandler = async () => {
    await option.item.setValue(!value);
  };

  return (
    <>
      <div className="option" onClick={changeHandler}>
        <label>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <label className="checkbox" htmlFor={option.name}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input type="checkbox" readOnly checked={value} name={option.name} id={option.name} />
        {/* onChange={changeHandler} */}
      </div>
      {option.description && <div className="description" onClick={changeHandler}>
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
