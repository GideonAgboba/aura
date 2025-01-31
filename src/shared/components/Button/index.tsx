import clsx from 'clsx';
import React from 'react';
import {useTheme} from '@hooks';
import {ColorVariant} from '@types';
import {ConditionalDiv} from '../ConditionalDiv';
import {Loader} from '../Loader/index';
import {Text} from '../Text';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ColorVariant;
  fluid?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconCenterLeft?: React.ReactNode;
  iconCenterRight?: React.ReactNode;
  outlined?: boolean;
  className?: string;
  titleStyle?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  testID,
  variant = 'primary',
  fluid = false,
  loading = false,
  disabled = false,
  icon,
  iconCenterLeft,
  iconCenterRight,
  outlined = false,
  className = '',
  titleStyle = '',
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[theme],
        fluid && styles.fluid,
        outlined && styles.outlined,
        disabled && styles.disabled,
        loading && styles.loading,
        className,
      )}
      disabled={disabled || loading}
      data-testid={testID}
      {...props}
    >
      <ConditionalDiv
        if={{
          condition: !!icon,
          render: (
            <Text as="span" className={styles.iconLeft}>
              {icon}
            </Text>
          ),
        }}
        else={
          <Text as="span" className={styles.content}>
            <ConditionalDiv
              if={{
                condition: !!iconCenterLeft,
                render: (
                  <>
                    <Text as="span" className={styles.iconCenter}>
                      {iconCenterLeft}
                    </Text>
                    <Text as="span" className={styles.spacer} />
                  </>
                ),
              }}
            />
            <ConditionalDiv
              if={{
                condition: !loading,
                render: (
                  <Text as="span" className={clsx(styles.title, titleStyle)}>
                    {title}
                  </Text>
                ),
              }}
              else={<Loader />}
            />
            <ConditionalDiv
              if={{
                condition: !!iconCenterRight,
                render: (
                  <Text as="span" className={styles.iconCenter}>
                    {iconCenterRight}
                  </Text>
                ),
              }}
            />
          </Text>
        }
      />
    </button>
  );
};
