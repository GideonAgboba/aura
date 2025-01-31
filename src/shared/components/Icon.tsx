import React from 'react';
import {ReactComponent as HappyEmoji} from '@assets/images/icons/reactions/happy.svg';
import {ReactComponent as NeutralEmoji} from '@assets/images/icons/reactions/neutral.svg';
import {ReactComponent as SadEmoji} from '@assets/images/icons/reactions/sad.svg';
import {ConditionalDiv} from './ConditionalDiv';

type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

const ICONS: Record<string, SVGComponent> = {
  'emoji-sad': SadEmoji,
  'emoji-neutral': NeutralEmoji,
  'emoji-happy': HappyEmoji,
};

export type IconName = keyof typeof ICONS;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: IconName;
  width?: number;
  height?: number;
}

export const Icon: React.FC<IconProps> = ({
  name = 'emoji-happy',
  width = 24,
  height = 24,
  ...props
}) => {
  const SvgIcon = ICONS[name];
  return (
    <ConditionalDiv
      if={{
        condition: !!SvgIcon,
        render: <SvgIcon width={width} height={height} {...props} />,
      }}
    />
  );
};
