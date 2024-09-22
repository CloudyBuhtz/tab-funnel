import { SelectHTMLAttributes } from "react";

export default ({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>): JSX.Element => {
  return (
    <div className="select-wrapper">
      <select {...props}>
        {children}
      </select>
      <div className="arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z"></path></svg>
      </div>
    </div>
  );
};
