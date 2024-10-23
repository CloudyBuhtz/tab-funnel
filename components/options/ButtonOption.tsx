import type { TButtonOption } from "@/entrypoints/utils/options";

interface CheckInputProps {
  option: TButtonOption;
}
export default ({ option }: CheckInputProps) => {
  return (
    <>
      <div className="option">
        <label>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
        <button className={option.danger ? "danger" : ""} onClick={e => { option.onPress(); }}>{i18n.t(option.button as any)}</button>
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
