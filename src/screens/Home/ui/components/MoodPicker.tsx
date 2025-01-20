/* eslint-disable react-native/no-inline-styles */
import {ConditionalView, Icon, Text, Timer, View} from '@components';
import {REACTIONS} from '@constants';
import tw from '@libs/tailwind';
import React from 'react';
import {
  Animated,
  PanResponder,
  Dimensions,
  View as DefaultView,
  ActivityIndicator,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {useMood, useTheme} from '@hooks';
import moment from 'moment';
import {eventEmitter} from '@helpers';
import {AppEventType, ReactionType} from '@types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const REACTION_POPOVER_WIDTH = SCREEN_WIDTH / 2;
const ITEM_SIZE = 50;
const MAX_SCALE = 2;
const CONTAINER_HEIGHT = 60;
const SPACING = 8;
const TAP_DURATION_THRESHOLD = 500;

export const MoodPicker: React.FC = React.memo(() => {
  const {isDark} = useTheme();
  const {activeEmotion, addMood} = useMood();
  const [isWithinBounds, setIsWithinBounds] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isHolding, setIsHolding] = React.useState<boolean>(false);
  const containerAnimation = React.useRef(new Animated.Value(0)).current;
  const dragX = React.useRef(new Animated.Value(0)).current;
  const holdTimeout = React.useRef<NodeJS.Timeout>();
  const pressStartTime = React.useRef(0);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const containerRef = React.useRef<DefaultView>(null);

  const getDailyTimeDiff = () => {
    const now = moment();
    const tomorrow = moment().add(1, 'day').startOf('day');
    return tomorrow.diff(now, 'seconds');
  };

  const [containerMeasurements, setContainerMeasurements] = React.useState({
    x: 0,
    width: 0,
  });

  const reactions = React.useMemo(() => {
    const reactionList = Object.entries(REACTIONS);
    return reactionList.map(([_, emoji]) => ({
      key: emoji.type,
      name: emoji.name,
      icon: emoji.icon,
    }));
  }, []);

  const activeReaction = React.useMemo(() => {
    return reactions[selectedIndex];
  }, [reactions, selectedIndex]);

  const checkWithinBounds = React.useCallback(
    (touchX: number) => {
      const relativeX = touchX - containerMeasurements.x;
      const isInBounds =
        relativeX >= 0 && relativeX <= containerMeasurements.width;
      setIsWithinBounds(isInBounds);
      return isInBounds;
    },
    [containerMeasurements],
  );

  const handlePress = React.useCallback(() => {
    setIsLoading(true);
    addMood(ReactionType.NEUTRAL, () => setIsLoading(false));
    eventEmitter.emit(AppEventType.MOOD_SYNC, {
      timestamp: new Date(),
      success: true,
      entries: 1,
    });
  }, [addMood]);

  const handleSelect = React.useCallback(
    (reactionType: number) => {
      setIsLoading(true);
      addMood(reactionType, () => setIsLoading(false));
      eventEmitter.emit(AppEventType.MOOD_SYNC, {
        timestamp: new Date(),
        success: true,
        entries: 1,
      });
    },
    [addMood],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => isHolding,
        onPanResponderGrant: () => {
          pressStartTime.current = Date.now();
          holdTimeout.current = setTimeout(() => {
            setIsHolding(true);
            containerRef.current?.measure((x, y, width, height, pageX) => {
              setContainerMeasurements({x: pageX, width});
            });
            Animated.spring(containerAnimation, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40,
              friction: 7,
            }).start();
          }, 500);
        },
        onPanResponderMove: event => {
          if (!isHolding) {
            return;
          }

          const touchX = event.nativeEvent.pageX;
          const isInBounds = checkWithinBounds(touchX);

          if (isInBounds) {
            const relativeX = touchX - containerMeasurements.x;
            dragX.setValue(relativeX);

            const itemTotalWidth = ITEM_SIZE + SPACING * 2;
            const index = Math.floor(relativeX / itemTotalWidth);
            setSelectedIndex(
              Math.min(Math.max(0, index), reactions.length - 1),
            );
          } else {
            setSelectedIndex(-1);
          }
        },
        onPanResponderRelease: () => {
          clearTimeout(holdTimeout.current);
          const pressDuration = Date.now() - pressStartTime.current;

          if (pressDuration < TAP_DURATION_THRESHOLD && !isHolding) {
            handlePress();
          } else if (isHolding && isWithinBounds && selectedIndex !== -1) {
            handleSelect(Number(reactions[selectedIndex].key));
          }

          Animated.spring(containerAnimation, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
          }).start(() => {
            setIsHolding(false);
            setSelectedIndex(-1);
            setIsWithinBounds(false);
            dragX.setValue(0);
          });
        },
        onPanResponderTerminate: () => {
          clearTimeout(holdTimeout.current);
          setIsHolding(false);
          setSelectedIndex(-1);
          setIsWithinBounds(false);
          dragX.setValue(0);
          Animated.spring(containerAnimation, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
          }).start();
        },
      }),
    [
      isHolding,
      containerAnimation,
      checkWithinBounds,
      containerMeasurements.x,
      dragX,
      reactions,
      isWithinBounds,
      selectedIndex,
      handlePress,
      handleSelect,
    ],
  );

  const emojiContainer = React.useMemo(
    () => (
      <Animated.View
        ref={containerRef}
        style={[
          tw`absolute`,
          {
            bottom: 70,
            alignSelf: 'center',
            width: REACTION_POPOVER_WIDTH,
            height: CONTAINER_HEIGHT,
            zIndex: 999,
            transform: [
              {
                scale: containerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
            opacity: containerAnimation,
          },
        ]}>
        <View className="flex-1 rounded-full flex-row items-center justify-center">
          <ConditionalView
            if={{
              condition: !!activeReaction,
              render: (
                <View className="absolute -top-8 left-0 right-0 items-center z-50">
                  <View className="bg-primary px-4 py-1 rounded-full">
                    <Text className="text-white font-medium text-sm capitalize">
                      {activeReaction?.name}
                    </Text>
                  </View>
                </View>
              ),
            }}
          />

          {reactions.map((reaction, index) => {
            const itemTotalWidth = ITEM_SIZE + SPACING * 2;
            const emojiStartX = index * itemTotalWidth;
            const emojiEndX = emojiStartX + itemTotalWidth;

            const scale = dragX.interpolate({
              inputRange: [
                emojiStartX - itemTotalWidth,
                emojiStartX,
                (emojiStartX + emojiEndX) / 2,
                emojiEndX,
                emojiEndX + itemTotalWidth,
              ],
              outputRange: [1, 1, MAX_SCALE, 1, 1],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={reaction.key}
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  marginHorizontal: SPACING,
                  transform: [{scale}],
                }}>
                <View className="w-full h-full justify-center items-center">
                  <Animated.View>
                    <Icon name={reaction.icon as any} width={40} height={40} />
                  </Animated.View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    ),
    [activeReaction, containerAnimation, dragX, reactions],
  );

  return (
    <View className="absolute right-0 left-0 bottom-0 h-32">
      <View className="flex-1 items-center justify-end">
        {emojiContainer}
        <View className="justify-center items-center">
          <Animated.View
            {...panResponder.panHandlers}
            style={tw.style(
              `rounded-full w-[${ITEM_SIZE}px] h-[${ITEM_SIZE}px] shadow-sm`,
              {'bg-white dark:bg-gray-900': !activeEmotion || isHolding},
            )}>
            <View
              style={tw`items-center justify-center rounded-full w-[${ITEM_SIZE}px] h-[${ITEM_SIZE}px]`}>
              <ConditionalView
                if={{
                  condition: !!activeEmotion && !isHolding && !isLoading,
                  render: (
                    <AnimatableView animation="pulse">
                      <Icon
                        name={activeEmotion?.icon as any}
                        width={ITEM_SIZE}
                        height={ITEM_SIZE}
                      />
                    </AnimatableView>
                  ),
                }}
                elseIf={[
                  {
                    condition: !!activeEmotion && !isHolding && isLoading,
                    render: (
                      <ActivityIndicator
                        color={tw.color(isDark ? 'white' : 'gray-200')}
                      />
                    ),
                  },
                ]}
                else={<Text type="header">?</Text>}
              />
            </View>
          </Animated.View>
          <View className="my-2">
            <View className="flex-row gap-x-2 items-center justify-center">
              <Text className="font-bold">Today's Mood</Text>
              <Timer
                timer={getDailyTimeDiff()}
                // TODO: Probably show a confetti based on mood trend or current mood
                // onExpire={handleTimerExpire}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

MoodPicker.displayName = 'MoodPicker';
