import type { CheckOption } from "@/entrypoints/utils/options";
import { StorageItemKey } from "wxt/storage";

interface CheckInputProps {
  option: CheckOption;
}
export default ({ option }: CheckInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState(option.defaultValue);

  const unwatch = storage.watch<boolean>(storageKey, (value) => {
    if (value === null) {
      return;
    }
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<boolean>(storageKey);
      if (value === null) { return; };
      setValue(value);
    };
    setup();
  }, []);

  const changeHandler = async () => {
    await storage.setItem(storageKey, !value);
  };

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{option.label}</label>
        <input
          onChange={changeHandler}
          type="checkbox"
          checked={value}
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
