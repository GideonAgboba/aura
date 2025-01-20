import {ActivityIndicator, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import tw from '@libs/tailwind';
import {BUTTON_PRESS_OPACITY} from '@constants';
import {View} from './View';
import {ConditionalView} from './ConditionalView';
import {Text} from './Text';
import {ColorVariant} from '@types';

interface ButtonProps {
  title: string;
  variant?: ColorVariant;
  fluid?: boolean;
  loading?: boolean;
  loaderSize?: number;
  disabled?: boolean;
  icon?: JSX.Element;
  iconCenterLeft?: JSX.Element;
  iconCenterRight?: JSX.Element;
  error?: string;
  touched?: boolean;
  outlined?: boolean;
  containerStyle?: ViewStyle | string;
  textStyle?: ViewStyle | string;
  onPress?: () => void;
}

export function Button({
  title,
  icon,
  iconCenterLeft,
  iconCenterRight,
  fluid = false,
  outlined = false,
  disabled = false,
  loading = false,
  loaderSize = 14,
  variant = 'primary',
  containerStyle,
  textStyle,
  ...props
}: ButtonProps) {
  const defaultColor = useMemo(() => {
    switch (variant) {
      case 'primary':
        return tw.color('primary');
      case 'info':
        return tw.color('blue-400');
        case 'secondary':
          return tw.color('black');

      default:
        return tw.color('primary');
    }
  }, [variant]);

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      activeOpacity={BUTTON_PRESS_OPACITY}
      style={tw.style(
        `flex-row gap-x-3 items-center h-[52px] rounded-full bg-[${defaultColor}] px-[12px]`,
        {'w-full': fluid},
        {[`border-[${defaultColor}] bg-white`]: outlined},
        {'bg-gray-400': disabled},
        containerStyle,
      )}>
      <View className="flex-1">{icon && icon}</View>
      <View className="grow-[2] items-center">
        <ConditionalView
          if={{
            condition: !loading,
            render: (
              <View className="flex-row items-center">
                {iconCenterLeft && iconCenterLeft}
                <Text
                  className="text-white text-center font-semibold text-[16px]"
                  style={tw.style(
                    {
                      ['font-medium text-[14px]']:
                        disabled,
                    },
                    textStyle,
                  )}>
                  {title}
                </Text>
                {iconCenterRight && iconCenterRight}
              </View>
            ),
          }}
          else={
            <ActivityIndicator color={tw.color('white')} size={loaderSize} />
          }
        />
      </View>
      <View className="flex-1" />
    </TouchableOpacity>
  );
}
