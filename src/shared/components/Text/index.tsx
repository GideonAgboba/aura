import React from "react";
import styles from "./index.module.css";
import clsx from "clsx";

type TextType =
  | "heading"
  | "header"
  | "sub-heading"
  | "title"
  | "normal"
  | "small"
  | "extra-small";
type ElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "b";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  testID?: string;
  type?: TextType;
  className?: string;
  as?: ElementType;
  children?: React.ReactNode;
}

const typeToElement: Record<TextType, ElementType> = {
  heading: "h1",
  header: "h2",
  "sub-heading": "h3",
  title: "h4",
  normal: "p",
  small: "span",
  "extra-small": "span",
};

const typeToStyles: Record<TextType, string> = {
  heading: styles.heading,
  header: styles.header,
  "sub-heading": styles.subHeading,
  title: styles.title,
  normal: styles.normal,
  small: styles.small,
  "extra-small": styles.extraSmall,
};

export const Text: React.FC<TextProps> = ({
  testID,
  type = "normal",
  className = "",
  as,
  children,
  ...props
}) => {
  const Element = as || typeToElement[type];
  const typeStyleTag = as ? Object.entries(typeToElement).find(([_, val]) => val === as)?.[0] as TextType : type
  const typeStyle = typeToStyles[typeStyleTag];

  return React.createElement(
    Element,
    {
      ...props,
      className: clsx(styles.text, typeStyle, className, 'text'),
      "data-testid": testID,
    },
    children
  );
};

Text.displayName = "Text";
