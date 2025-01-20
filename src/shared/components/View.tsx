/* eslint-disable react/require-default-props */
import {
  View as DefaultView,
  KeyboardAvoidingView,
  Platform,
  ViewProps,
} from 'react-native';
import React from 'react';
import tw from '../libs/tailwind';

interface Props extends ViewProps {
  className?: string;
  container?: boolean;
  pointerEventDisabled?: boolean;
  isKeyboardAware?: boolean;
}

export const View = React.forwardRef(
  (props: Props, ref: React.Ref<DefaultView>) => {
    const {
      style,
      className = '',
      container = false,
      pointerEventDisabled = false,
      isKeyboardAware = false,
    } = props;

    const content = React.useMemo(
      () => (
        <DefaultView
          ref={ref}
          {...props}
          style={tw.style(
            {
              'pointer-events-none': pointerEventDisabled,
            },
            {'px-4': container},
            className,
            style as any,
          )}
        />
      ),
      [className, container, pointerEventDisabled, props, ref, style],
    );

    if (isKeyboardAware) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`flex-1`}>
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  },
);
