import type { TextOptionV2 } from "@/entrypoints/utils/options";

interface TextInputProps {
  option: TextOptionV2;
}
export default ({ option }: TextInputProps) => {
  const [value, setValue] = useState<string>(option.item.fallback);
  const regex = new RegExp(option.pattern ?? /[]/);

  useEffect(() => {
    const setup = async () => {
      const value = await option.item.getValue();
      setValue(value);
    };
    setup();
  }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const filtered = val.replace(regex, "");

    setValue(filtered ?? option.item.fallback);
    console.log(value);
    option.item.setValue(filtered || option.item.fallback);
  };

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <input
          onInput={changeHandler}
          type="text"
          value={value}
          placeholder={option.placeholder}
          name={option.name}
          id={option.name} />
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
