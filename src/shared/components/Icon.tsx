import React from 'react';
import {SvgProps} from 'react-native-svg';
import SadEmoji from '@assets/images/icons/reactions/sad.svg';
import NeutralEmoji from '@assets/images/icons/reactions/neutral.svg';
import HappyEmoji from '@assets/images/icons/reactions/happy.svg';

const ICONS = {
  'emoji-sad': SadEmoji,
  'emoji-neutral': NeutralEmoji,
  'emoji-happy': HappyEmoji,
};

export interface IconProps extends SvgProps {
  name: keyof typeof ICONS;
  width?: string | number;
  height?: string | number;
}

export function Icon(props: IconProps) {
  const {name, ...restProps} = props;
  const SvgIcon = ICONS[name];

  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon {...restProps} />;
}
