import React from "react";
import styles from "./index.module.css";
import { ColorVariant } from "@types";
import { useTheme } from "@hooks";
import { ConditionalDiv } from "../ConditionalDiv";
import { Loader } from "../Loader/index";
import clsx from "clsx";
import { Text } from "../Text";

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
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  testID,
  variant = "primary",
  fluid = false,
  loading = false,
  disabled = false,
  icon,
  iconCenterLeft,
  iconCenterRight,
  outlined = false,
  className = "",
  ...props
}) => {
  const { theme } = useTheme();

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
        className
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
                  <Text as="span" className={styles.title}>
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
