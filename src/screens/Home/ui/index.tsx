import {View} from '@components';
import tw from '@libs/tailwind';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Routes} from '@types';
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Header} from './layouts/Header';
import {DailyInsights, MoodPicker} from './components';
import {useTheme} from '@hooks';

type Props = NativeStackScreenProps<RootStackParamList, Routes.Home>;

const Home = ({navigation}: Props) => {
  const {isDark} = useTheme();
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 dark:bg-gray-800`}>
      <StatusBar
        hidden={false}
        translucent={false}
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={tw.color(isDark ? 'gray-800' : 'gray-100')}
      />
      <View container style={tw`flex-1 gap-y-4 pb-8`}>
        <Header navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <DailyInsights />
        </ScrollView>
        <MoodPicker />
      </View>
    </SafeAreaView>
  );
};

export default Home;
