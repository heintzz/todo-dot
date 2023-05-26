import React from 'react';

const Button: React.FC<{ children: React.ReactNode; cls: string; clickHandler: () => void }> = ({ children, cls, clickHandler }) => {
  return <div className={`flex items-center font-semibold md:text-[1.125rem] gap-x-1 px-3 py-1 md:px-6 md:py-3 rounded-[45px] ${cls}`} onClick={clickHandler}>{children}</div>;
};

export default Button;
