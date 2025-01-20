import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, Routes} from '@types';
import SplashScreen from '@screens/SplashScreen/ui';
import Onboarding from '@screens/Onboarding/ui';
import Home from '@screens/Home/ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Splash}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Routes.Splash} component={SplashScreen} />
      <Stack.Screen name={Routes.Onboarding} component={Onboarding} />
      <Stack.Screen name={Routes.Home} component={Home} />
    </Stack.Navigator>
  );
};

export default Navigation;
