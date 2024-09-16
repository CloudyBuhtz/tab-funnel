import type { TextOption } from "@/entrypoints/utils/options";
import { StorageItemKey } from "wxt/storage";

interface TextInputProps {
  option: TextOption;
}
export default ({ option }: TextInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState<string>(option.defaultValue);
  const regex = new RegExp(option.pattern ?? /.*/);

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<string>(storageKey);
      if (value === null) { return; };
      setValue(value);
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
        <label htmlFor={option.name}>{option.label}</label>
        <input
          onInput={changeHandler}
          type="text"
          defaultValue={value}
          placeholder={option.placeholder}
          name={option.name}
          id={option.name} />
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>}
    </>
  );
};
