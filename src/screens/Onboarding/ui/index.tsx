import {Button, Text, TextInput, View} from '@components';
import {SHARED_TRANSITION_TAGS} from '@constants';
import {useTheme} from '@hooks';
import tw from '@libs/tailwind';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useStore} from '@store';
import {RootStackParamList, Routes} from '@types';
import React from 'react';
import {StatusBar} from 'react-native';
import Animated from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, Routes.Onboarding>;

const Onboarding = ({navigation}: Props) => {
  const {isDark} = useTheme();
  const {setUser} = useStore();
  const [username, setUsername] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = () => {
    setLoading(true);
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: username,
      createdAt: new Date(),
      settings: {
        notifications: true,
        darkMode: false,
        language: 'en',
      },
    });
    navigation.navigate(Routes.Home);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-800">
      <StatusBar
        hidden={false}
        translucent={false}
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={tw.color(isDark ? 'gray-800' : 'gray-100')}
      />
      <View
        isKeyboardAware
        className="flex-1 justify-center items-center gap-y-8">
        <View className="justify-center items-center">
          <View className="flex-row items-center gap-x-4 mb-8">
            <View className="bg-white rounded-full p-0.5">
              <Animated.Image
                sharedTransitionTag={SHARED_TRANSITION_TAGS.SPLASH.HEADER.id}
                source={require('@assets/images/icons/logo.png')}
                resizeMode="cover"
                style={tw`w-[60px] h-[60px] rounded-full`}
              />
            </View>
            <View>
              <View>
                <Text className="text-4xl font-semibold text-primary">
                  aura
                </Text>
                <Text className="font-mono text-red-300">/ˈɔːrə/</Text>
              </View>
            </View>
          </View>
          <View>
            <Text type="heading" className="text-center">
              Hi,{' '}
              <Text type="sub-heading" className="font-semibold capitalize">
                {username}
              </Text>
            </Text>
          </View>
          <View className="mt-2">
            <Text className="text-center">
              Let's get started by setting up your account
            </Text>
          </View>
        </View>

        <View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            placeholder="Enter your name here..."
          />
        </View>

        <View>
          <Button
            loading={loading}
            disabled={!username}
            title="Continue"
            onPress={onSubmit}
          />
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
