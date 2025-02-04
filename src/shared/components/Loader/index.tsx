import clsx from 'clsx';
import React from 'react';
import {Size} from '@types';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: Size;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({size = 'md', className = '', ...props}) => {
  const sizeClass = React.useMemo(() => {
    switch (size) {
      case 'sm':
        return styles.loaderSm;
      case 'md':
        return styles.loaderMd;
      case 'lg':
        return styles.loaderLg;
      case 'xl':
        return styles.loaderXl;

      default:
        return;
    }
  }, [size]);

  return <span className={clsx(styles.loader, sizeClass, className)} />;
};
