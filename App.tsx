import {ThemeProvider} from '@context';
import tw from '@libs/tailwind';
import Navigation from '@navigation/index';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default (): React.JSX.Element => {
  return (
    <SafeAreaProvider style={tw`flex-1`}>
      <GestureHandlerRootView style={tw`flex-1`}>
        <ThemeProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
