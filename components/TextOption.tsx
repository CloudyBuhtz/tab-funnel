import type { TextOption } from "@/entrypoints/utils/options";
import { StorageItemKey } from "wxt/storage";

interface TextInputProps {
  option: TextOption;
}
export default ({ option }: TextInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState<string>(option.defaultValue);
  const regex = new RegExp(option.pattern ?? /[]/);

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<string>(storageKey);
      setValue(value!);
    };
    setup();
  }, []);

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const filtered = val.replace(regex, "");
    event.target.value = filtered;

    setValue(filtered || option.defaultValue);
    await storage.setItem(storageKey, filtered || option.defaultValue);
  };

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{i18n.t(option.label as any)}</label>
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
