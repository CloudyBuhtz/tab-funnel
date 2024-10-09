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
        <label>{i18n.t(option.label)}</label>
        <label className="checkbox" htmlFor={option.name}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"></path></svg>
        </label>
        <input className="option" onChange={changeHandler} type="checkbox" checked={value} name={option.name} id={option.name} />
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line)}</div>
        ))}
      </div>}
    </>
  );
};
