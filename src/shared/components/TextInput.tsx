import {TextInput as DefaultTextInput, TextInputProps} from 'react-native';
import React from 'react';
import tw from '../libs/tailwind';

interface Props extends TextInputProps {
  className?: string;
  fluid?: boolean;
  pointerEventDisabled?: boolean;
}

export const TextInput = React.forwardRef(
  (props: Props, ref: React.Ref<DefaultTextInput>) => {
    const {
      style,
      className = '',
      fluid = false,
      pointerEventDisabled = false,
    } = props;

    const content = React.useMemo(
      () => (
        <DefaultTextInput
          ref={ref}
          {...props}
          placeholderTextColor={tw.color('gray-400')}
          style={tw.style(
            'text-base text-black dark:text-white',
            {
              'pointer-events-none': pointerEventDisabled,
            },
            {'w-full': fluid},
            className,
            style as any,
          )}
        />
      ),
      [className, fluid, pointerEventDisabled, props, ref, style],
    );

    return content;
  },
);
