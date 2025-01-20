import {Text as DefaultText, TextProps} from 'react-native';
import React from 'react';
import tw from '../libs/tailwind';

type TextType =
  | 'heading'
  | 'header'
  | 'sub-heading'
  | 'title'
  | 'normal'
  | 'small'
  | 'extra-small';

interface Props extends TextProps {
  type?: TextType;
  className?: string;
}

export function Text(props: Props) {
  const {type = 'normal', className = '', style, ...restProps} = props;
  const renderType = (value: TextType) => {
    switch (value) {
      case 'heading':
        return 'text-4xl';
      case 'header':
        return 'text-2xl';
      case 'sub-heading':
        return 'text-base';
      case 'title':
        return 'text-sm';
      case 'normal':
        return 'text-xs';
      case 'small':
        return 'text-[10px]';
      case 'extra-small':
        return 'text-[8px]';

      default:
        return 'text-xs';
    }
  };

  return (
    <DefaultText
      {...restProps}
      suppressHighlighting
      selectionColor="transparent"
      style={tw.style(
        `text-gray-700 dark:text-gray-200 leading-[18px] ${renderType(
          type,
        )}`,
        className,
        style as any,
      )}
    />
  );
}
