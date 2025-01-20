/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Pressable,
  TextInput as DefaultTextInput,
  Keyboard,
  InteractionManager,
} from 'react-native';
import {Button, ConditionalView, Text, TextInput, View} from '@components';
import {getTimeOfDay} from '@helpers';
import {
  UserIcon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from 'react-native-heroicons/outline';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {useTheme, useUser} from '@hooks';
import tw from '@libs/tailwind';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Routes} from '@types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    Routes.Home,
    undefined
  >;
}

export const Header = ({navigation}: Props) => {
  const {isDark, toggleTheme} = useTheme();
  const {user, logout, updateUser} = useUser();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>(user?.name || '');
  const inputRef = React.useRef<DefaultTextInput>(null);

  const handleToggleEdit = () => {
    setIsEditing(prev => !prev);
    InteractionManager.runAfterInteractions(() => inputRef.current?.focus());
  };

  const handleSave = () =>
    user &&
    updateUser({...user, name}, () => {
      setIsEditing(false);
      Keyboard.dismiss();
    });

  const handleLogout = () =>
    logout(() => {
      setIsEditing(false);
      Keyboard.dismiss();
      navigation.navigate(Routes.Onboarding);
    });

  const greetingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isEditing ? -300 : 0, {
            damping: 12,
            stiffness: 90,
          }),
        },
      ],
      opacity: withTiming(isEditing ? 0 : 1, {duration: 200}),
    };
  });

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isEditing ? 0 : 300, {
            damping: 12,
            stiffness: 90,
          }),
        },
      ],
      opacity: withTiming(isEditing ? 1 : 0, {duration: 200}),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      Number(isEditing),
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{rotate: withSpring(`${rotate}deg`)}],
    };
  });

  return (
    <View className="py-4">
      <View className="flex-row justify-between items-center gap-x-4">
        <View className="flex-1">
          <Animated.View style={[greetingStyle]}>
            <Text className="capitalize">Hi, Good {getTimeOfDay()}</Text>
            <Text type="header" className="capitalize font-semibold">
              {user?.name} 👋🏼
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              {position: 'absolute', width: '100%', zIndex: 2},
              inputStyle,
            ]}>
            <AnimatedTextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleSave}
              style={tw`h-12 px-4`}
              placeholder="Enter your name"
            />
            <View className="flex-row gap-2 mt-2">
              <Button variant="secondary" onPress={handleSave} title="Save" />
              <Button onPress={handleLogout} title="Logout" />
            </View>
          </Animated.View>
        </View>

        <AnimatedPressable
          onPress={handleToggleEdit}
          style={[
            tw`rounded-lg p-2 border border-gray-200 dark:border-gray-600`,
            iconStyle,
          ]}>
          <ConditionalView
            if={{
              condition: isEditing,
              render: (
                <XMarkIcon color={tw.color(isDark ? 'white' : 'gray-600')} />
              ),
            }}
            else={<UserIcon color={tw.color(isDark ? 'white' : 'gray-600')} />}
          />
        </AnimatedPressable>

        <AnimatedPressable
          onPress={toggleTheme}
          style={[
            tw`rounded-lg p-2 border border-gray-200 dark:border-gray-600`,
          ]}>
          <ConditionalView
            if={{
              condition: isDark,
              render: <MoonIcon color={tw.color('white')} />,
            }}
            else={<SunIcon color={tw.color('gray-600')} />}
          />
        </AnimatedPressable>
      </View>
    </View>
  );
};
