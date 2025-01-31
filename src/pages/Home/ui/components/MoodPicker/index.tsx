import clsx from 'clsx';
import {motion} from 'framer-motion';
import moment from 'moment';
import React from 'react';
import {ConditionalDiv, Div, Icon, Loader, Text, Timer} from '@components';
import {REACTIONS} from '@constants';
import {useMood, useTheme} from '@hooks';
import {eventEmitter} from '@lib';
import {AppEventType, ReactionType} from '@types';
import styles from './MoodPicker.module.css';

const MAX_SCALE = 1.5;
const HOLD_DURATION = 300;
const TRANSITION_SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
};

export const MoodPicker: React.FC = () => {
  const {activeEmotion, addMood} = useMood();
  const {isDark} = useTheme();
  const [isHolding, setIsHolding] = React.useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const holdTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDragging = React.useRef(false);

  const activeReaction = REACTIONS[selectedIndex];

  const handleClick = React.useCallback(() => {
    if (activeReaction && activeReaction.type === ReactionType.NEUTRAL) {
      handlePointerDown();
      return false;
    }
    setIsLoading(true);
    addMood(ReactionType.NEUTRAL, () => {
      setIsLoading(false);
      setSelectedIndex(1);
    });
    eventEmitter.emit(AppEventType.MOOD_SYNC, {
      timestamp: new Date(),
      success: true,
      entries: 1,
    });
  }, [activeReaction, addMood]);

  const handleSelection = React.useCallback(
    (reactionType: ReactionType) => {
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

  const handlePointerDown = () => {
    isDragging.current = false;
    holdTimeout.current = setTimeout(() => {
      setIsHolding(true);
    }, HOLD_DURATION);
  };

  const handlePointerMove = () => {
    if (!isHolding || !containerRef.current) return;

    isDragging.current = true;
  };

  const handlePointerUp = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = undefined;
    }

    if (!isHolding) {
      handleClick();
    } else if (selectedIndex !== -1) {
      handleSelection(REACTIONS[selectedIndex].type);
    }

    setIsHolding(false);
    isDragging.current = false;
  };

  React.useEffect(() => {
    const initialSelectedIndex = !!activeEmotion
      ? REACTIONS.findIndex((r) => r.type === activeEmotion.type)
      : -1;
    setSelectedIndex(initialSelectedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Div className={styles.container}>
      <Div
        className={styles.containerContent}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={(e) => {
          const relatedTarget = e.relatedTarget as Element | null;
          if (!relatedTarget) {
            handlePointerUp();
          }
        }}
      >
        <ConditionalDiv
          if={{
            condition: isHolding,
            render: (
              <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: 10, opacity: 0}}
                transition={TRANSITION_SPRING}
                className={styles.emojiContainer}
              >
                <ConditionalDiv
                  if={{
                    condition: !!activeReaction,
                    render: (
                      <motion.div
                        initial={{y: -10, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        className={styles.reactionName}
                      >
                        <Text as="span">{activeReaction?.name}</Text>
                      </motion.div>
                    ),
                  }}
                />
                <Div className={styles.reactionsRow}>
                  {REACTIONS.map((reaction, index) => (
                    <motion.div
                      key={reaction.type + '--reaction'}
                      className={styles.reactionItem}
                      animate={{
                        scale: selectedIndex === index ? MAX_SCALE : 1,
                      }}
                      whileHover={{
                        scale: selectedIndex === index ? MAX_SCALE : 1.5,
                      }}
                      transition={{
                        scale: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        },
                      }}
                      onHoverStart={() => setSelectedIndex(index)}
                    >
                      <Icon name={reaction.icon} width={40} height={40} />
                    </motion.div>
                  ))}
                </Div>
              </motion.div>
            ),
          }}
        />

        <Div className={styles.pickerContent}>
          <motion.div
            ref={containerRef}
            whileTap={{scale: 0.95}}
            className={clsx(styles.moodButton, !!activeReaction && styles.moodButtonNoBg)}
          >
            <ConditionalDiv
              if={{
                condition: isLoading,
                render: <Loader />,
              }}
              else={
                <ConditionalDiv
                  if={{
                    condition: !!activeReaction,
                    render: (
                      <Icon
                        name={activeReaction?.icon}
                        width={isHolding ? 20 : 60}
                        height={isHolding ? 20 : 60}
                      />
                    ),
                  }}
                  else={
                    <Text as="span" className={styles.questionMark}>
                      ?
                    </Text>
                  }
                />
              }
            />
          </motion.div>

          <Div className={clsx(styles.timerContainer, isDark && styles.timerContainerDark)}>
            <Text as="span" className={styles.timerText}>
              Today's Mood
            </Text>
            <Timer timer={moment().endOf('day').diff(moment(), 'seconds')} />
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

MoodPicker.displayName = 'MoodPicker';
