import {REACTIONS, TREND_THRESHOLDS} from '@constants';
import {MoodEntry, MoodTrendAnalysis} from '@types';

/**
 * @note
 * The getRandomNumber number helper function dynamically mocks the user’s mood data as requested in Technical details (3.):
 * - Data Handling: Mock the user’s mood data in a local array (e.g., an array of objects with dates and mood scores).
 */
export const generateRandomMoodEntries = (numberOfDays: number = 10): MoodEntry[] => {
  const moodTypes = REACTIONS.map((reaction) => reaction.name);
  const moodScores = REACTIONS.reduce(
    (acc, reaction, index) => ({
      ...acc,
      [reaction.name]: REACTIONS.length - index,
    }),
    {} as Record<string, number>,
  );
  const entries: MoodEntry[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const randomMood = moodTypes[Math.floor(Math.random() * moodTypes.length)];

    entries.push({
      id: Math.random().toString(36).substring(7),
      timestamp: date,
      mood: moodScores[randomMood],
      score: moodScores[randomMood],
      note: `Random mood for ${date.toLocaleDateString()}`,
    });
  }

  return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

/**
 * @note I had to improve logic to properly analyze mood data for both directional trends and intensity of fluctuations
 * to provide comprehensive mood pattern analysis and good feedback.
 */
export const analyzeMoodTrend = (entries: MoodEntry[]): MoodTrendAnalysis => {
  const hasEnoughData = entries.length >= 3;
  if (!hasEnoughData) {
    return {
      message: 'Not enough data for analysis',
      trend: 'stable',
      severity: 'neutral',
      fluctuationRate: 0,
    };
  }

  try {
    const scores = entries.map((entry) => entry.score);

    // Sequential differences for trend analysis
    const differences = scores.slice(1).map((score, i) => score - scores[i]);
    const averageChange = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;

    // Mood fluctuations
    const fluctuations = differences.reduce(
      (count, change) => count + (Math.abs(change) > 0 ? 1 : 0),
      0,
    );

    const fluctuationRate = fluctuations / differences.length;

    const isHighlyVariable = fluctuationRate > TREND_THRESHOLDS.HIGH_FLUCTUATION;
    const isModeratelyVariable = fluctuationRate > TREND_THRESHOLDS.MODERATE_FLUCTUATION;
    const isSignificantlyImproving = averageChange > TREND_THRESHOLDS.SIGNIFICANT_CHANGE;
    const isSignificantlyDeclining = averageChange < -TREND_THRESHOLDS.SIGNIFICANT_CHANGE;

    if (isSignificantlyImproving) {
      return {
        message: isHighlyVariable
          ? 'Your mood is improving despite some ups and downs! Keep going! 🚀'
          : 'Your mood has been steadily improving. Great progress! 🌟',
        trend: 'improving',
        severity: 'positive',
        fluctuationRate,
      };
    }

    if (isSignificantlyDeclining) {
      return {
        message: isHighlyVariable
          ? "You've had some challenging days recently. Remember, ups and downs are normal 💪"
          : "You've been feeling down lately. Consider talking to someone or trying mood-lifting activities 💝",
        trend: 'declining',
        severity: 'concern',
        fluctuationRate,
      };
    }

    if (isHighlyVariable) {
      return {
        message:
          'Your mood has been quite variable. Try to identify what affects your mood most 🎯',
        trend: 'variable',
        severity: 'neutral',
        fluctuationRate,
      };
    }

    if (isModeratelyVariable) {
      return {
        message: 'Your mood has had some variations, but nothing unusual. Stay mindful! 🌈',
        trend: 'variable',
        severity: 'neutral',
        fluctuationRate,
      };
    }

    return {
      message: "Your mood has been relatively stable. That's great! 🌟",
      trend: 'stable',
      severity: 'positive',
      fluctuationRate,
    };
  } catch (error) {
    console.error('Error analyzing mood trend:', error);
    return {
      message: 'Unable to analyze mood trend',
      trend: 'stable',
      severity: 'neutral',
      fluctuationRate: 0,
    };
  }
};

export const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;
