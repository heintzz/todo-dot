import { TodoItem } from '@/pages/detail/[id]';
import React from 'react';

type clickFn = (() => void) | ((param: React.MouseEvent | TodoItem) => void);
interface ButtonProps {
  children: React.ReactNode;
  clickHandler: clickFn;
  variant?: string;
  isDisable?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, clickHandler, variant = 'primary', isDisable = false }) => {
  const variantClass: { [key: string]: string } = {
    primary: 'bg-primary text-white',
    delete: 'bg-delete text-white',
    cancel: 'bg-cancelWhite text-cancelGray',
  };

  return (
    <button
      type="button"
      className={`flex items-center font-semibold md:text-[1.125rem] w-fit gap-x-1 px-3 py-1 md:px-6 md:py-3 rounded-[45px] disabled:opacity-25  ${variantClass[variant]}`}
      onClick={clickHandler}
      disabled={isDisable}
    >
      {children}
    </button>
  );
};

export default Button;
