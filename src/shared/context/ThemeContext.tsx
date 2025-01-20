import tw from '@libs/tailwind';
import {useStore} from '@store';
import {EffectiveTheme, ThemeContextType} from '@types';
import React from 'react';
import {useColorScheme} from 'react-native';
import {useAppColorScheme} from 'twrnc';

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme() as EffectiveTheme;
  const [_c, toggleTwrncColorScheme, setTwrncColorScheme] =
    useAppColorScheme(tw);
  const {theme, setTheme} = useStore();

  const effectiveTheme: EffectiveTheme =
    theme === 'system' ? systemColorScheme : (theme as EffectiveTheme);

  const isDark = effectiveTheme === 'dark';

  React.useLayoutEffect(() => {
    setTwrncColorScheme(effectiveTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = (): void => {
    toggleTwrncColorScheme();
    setTheme(isDark ? 'light' : 'dark');
  };

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    isDark,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
