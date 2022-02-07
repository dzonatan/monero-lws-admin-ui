import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}

export default function Button({ primary = false, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} ${
        primary
          ? 'text-indigo-600 hover:text-indigo-900'
          : 'text-red-600 hover:text-red-900'
      } ${props.disabled ? 'opacity-40' : ''}`}
    >
      {props.children}
    </button>
  );
}
