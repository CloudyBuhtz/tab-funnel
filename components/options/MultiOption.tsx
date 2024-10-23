import type { TMultiOption } from "@/entrypoints/utils/options";
import SelectInput from "../SelectInput";

interface MultiInputProps {
  option: TMultiOption;
}
export default ({ option }: MultiInputProps) => {
  const [value, setValue] = useState<string>(option.item.fallback);

  const unwatch = option.item.watch((value) => {
    if (value === null) { return; }
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      const value = await option.item.getValue();
      if (value === null) { return; }
      setValue(value);
    };
    setup();
  }, []);

  const changeHandler = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await option.item.setValue(event.target.value);
  };

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <SelectInput onChange={changeHandler} name={option.name} id={option.name} value={value}>
          {option.options.map((item) => (<option key={item} value={item}>{item.replaceAll("_", " ").split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>))}
        </SelectInput>
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
