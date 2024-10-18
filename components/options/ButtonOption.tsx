import type { ButtonOptionV2 } from "@/entrypoints/utils/options";

interface CheckInputProps {
  option: ButtonOptionV2;
}
export default ({ option }: CheckInputProps) => {
  return (
    <>
      <div className="option">
        <div className="spacer"></div>
        <button onClick={e => { option.onPress(); }}>{i18n.t(option.label as any)}</button>
        <div className="spacer"></div>
      </div>
      {option.description && <div className="description">
        {option.description.map((line, index) => (
          <div key={index}>{i18n.t(line as any)}</div>
        ))}
      </div>}
    </>
  );
};
