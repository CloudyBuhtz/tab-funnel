import type {
  CheckOption,
  TextOption,
  MultiOption,
} from "@/entrypoints/utils/options";
import { StorageItemKey } from "wxt/storage";

interface TextInputProps {
  option: TextOption;
}
export const TextInput = ({ option }: TextInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState<string>(option.defaultValue);
  const regex = new RegExp(option.pattern ?? /.*/);

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<string>(storageKey);
      if (value === null) { return };
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
          id={option.name}
        />
      </div>
      {option.description && <div className="description" dangerouslySetInnerHTML={{ __html: option.description }}></div>}
    </>
  );
};

interface CheckInputProps {
  option: CheckOption;
}
export const CheckInput = ({ option }: CheckInputProps) => {
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
      if (value === null) { return };
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
          id={option.name}
        />
      </div>
      {option.description && <div className="description" dangerouslySetInnerHTML={{ __html: option.description }}></div>}
    </>
  );
};

interface MultiInputProps {
  option: MultiOption;
}
export const MultiInput = ({ option }: MultiInputProps) => {
  const storageKey = `${option.area}:${option.name}` as StorageItemKey;
  const [value, setValue] = useState<string>(option.defaultValue);

  const unwatch = storage.watch<string>(storageKey, (value) => {
    if (value === null) { return }
    setValue(value);
  });

  useEffect(() => {
    const setup = async () => {
      const value = await storage.getItem<string>(storageKey);
      if (value === null) { return }
      setValue(value);
    }
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
      {option.description && <div className="description" dangerouslySetInnerHTML={{ __html: option.description }}></div>}
    </>
  );
};
