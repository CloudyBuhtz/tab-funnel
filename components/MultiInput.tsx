import type { MultiOption } from "@/entrypoints/utils/options";
import { StorageItemKey } from "wxt/storage";

interface MultiInputProps {
  option: MultiOption;
}
export default ({ option }: MultiInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState<string>(option.defaultValue);

  const unwatch = storage.watch<string>(storageKey, (value) => {
    if (value === null) { return; }
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<string>(storageKey);
      if (value === null) { return; }
      setValue(value);
    };
    setup();
  }, []);

  const changeHandler = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await storage.setItem(storageKey, event.target.value);
  };

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{option.label}</label>
        <div className="select-wrapper">
          <select onChange={changeHandler} name={option.name} id={option.name} value={value}>
            {option.options.map((item) => (<option key={item} value={item}>{item.replaceAll("_", " ").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>))}
          </select>
        </div>
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>}
    </>
  );
};
