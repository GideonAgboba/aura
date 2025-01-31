import clsx from 'clsx';
import React from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  fluid?: boolean;
  pointerEventDisabled?: boolean;
  isDark?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {className = '', fluid = false, pointerEventDisabled = false, isDark = false, ...props},
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type="text"
        className={clsx(
          styles.input,
          isDark && styles.dark,
          fluid && styles.fluid,
          pointerEventDisabled && styles.disabled,
          className,
        )}
        {...props}
      />
    );
  },
);
