import React from 'react';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  testID?: string;
  className?: string;
  container?: boolean;
  pointerEventDisabled?: boolean;
}

export const Div = React.forwardRef<HTMLDivElement, DivProps>(
  (
    {style, testID, className = '', container = false, pointerEventDisabled = false, ...props},
    ref,
  ) => {
    const classes = [
      pointerEventDisabled && 'pointer-events-none',
      container && 'container',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        data-testid={testID}
        ref={ref}
        {...props}
        className={classes}
        style={{
          ...style,
        }}
      />
    );
  },
);
