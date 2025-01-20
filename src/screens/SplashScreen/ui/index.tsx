import {Text, View} from '@components';
import {SHARED_TRANSITION_TAGS, SPLASH_SIMILAR_WORDS} from '@constants';
import tw from '@libs/tailwind';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useStore, useStoreHydration} from '@store';
import {RootStackParamList, Routes} from '@types';
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Image} from 'react-native-animatable';
import Animated from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, Routes.Splash>;

const SplashScreen = ({navigation}: Props) => {
  const isHydrated = useStoreHydration();
  const {user} = useStore();

  React.useEffect(() => {
    requestAnimationFrame(() => {
      if (isHydrated) {
        setTimeout(() => {
          if (user) {
            navigation.navigate(Routes.Home);
          } else {
            navigation.navigate(Routes.Onboarding);
          }
        }, 2000); // Just some extra seconds to read 😉
      }
    });
  }, [isHydrated, navigation, user]);

  return (
    <SafeAreaView style={tw`flex-1 bg-primary`}>
      <StatusBar
        hidden={false}
        translucent={false}
        barStyle="light-content"
        backgroundColor={tw.color('primary')}
      />
      <View container className="py-4">
        <View className="flex-row items-center gap-4 mb-6">
          <View className="bg-white rounded-full p-0.5">
            <Animated.View
              sharedTransitionTag={SHARED_TRANSITION_TAGS.SPLASH.HEADER.id}
              style={tw`w-[40px] h-[40px] rounded-full`}>
              <Image
                animation="pulse"
                iterationCount="infinite"
                source={require('@assets/images/icons/logo.png')}
                resizeMode="cover"
                style={tw`w-[40px] h-[40px] rounded-full`}
              />
            </Animated.View>
          </View>
          <View>
            <Text className="text-4xl font-semibold text-white">aura</Text>
            <Text className="font-mono text-gray-100">/ˈɔːrə/</Text>
          </View>
        </View>
        <Text className="text-white mb-6">
          noun: <Text className="font-semibold">aura</Text>; plural noun:{' '}
          <Text className="font-semibold">aurae</Text>; plural noun:{' '}
          <Text className="font-semibold">auras</Text>
        </Text>

        <ScrollView>
          <View>
            <View>
              <Text className="text-white">
                the distinctive atmosphere or quality that seems to surround and
                be generated by a person, thing, or place.
              </Text>
              <Text className="text-gray-300 italic">
                "the ceremony retains an aura of mystery"
              </Text>

              <View className="my-4">
                <Text className="text-white font-bold mb-2">Similar:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {SPLASH_SIMILAR_WORDS.map((word, index) => (
                    <View
                      key={index}
                      className="bg-gray-800 rounded-full px-3 py-1">
                      <Text className="text-gray-300 text-sm">{word}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View>
              <Text className="text-gray-100">
                (in <Text className="underline">spiritualism</Text> and some
                forms of alternative medicine) a supposed{' '}
                <Text className="underline">emanation</Text> surrounding the
                body of a living creature and regarded as an essential part of
                the individual.
              </Text>
              <Text className="text-gray-300 italic">
                "emotional, mental, and spiritual levels form an energy field
                around the body known as the aura"
              </Text>

              <View className="mt-4">
                <Text className="text-gray-100">
                  • any invisible emanation, especially an{' '}
                  <Text className="underline">odour</Text>.
                </Text>
                <Text className="text-gray-300 italic mt-1">
                  "there was a faint aura of disinfectant"
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
