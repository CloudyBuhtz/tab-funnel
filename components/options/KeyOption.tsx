import type { TKeyOption } from "@/entrypoints/utils/options";

interface KeyInputProps {
  option: TKeyOption;
}
export default ({ option }: KeyInputProps) => {
  const [value, setValue] = useState<string>(option.item.fallback);
  const unwatch = option.item.watch(v => setValue(v));

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
        <button onClick={() => option.item.setValue(option.gen())} className="refresh">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 0 0-8 8a8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6a6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" />
          </svg>
        </button>
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
