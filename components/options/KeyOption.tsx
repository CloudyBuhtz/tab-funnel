import type { KeyOptionV2 } from "@/entrypoints/utils/options";

interface KeyInputProps {
  option: KeyOptionV2;
}
export default ({ option }: KeyInputProps) => {
  const [value, setValue] = useState<string>(option.item.fallback);

  useEffect(() => {
    const setup = async () => {
      const value = await option.item.getValue();
      setValue(value);
    };
    setup();
  }, []);

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <input
          readOnly
          type="text"
          className="key"
          value={value}
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
