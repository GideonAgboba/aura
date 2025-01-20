import React, {act} from 'react';
import {render} from '@testing-library/react-native';
import {useMood, useEvent} from '@hooks';
import {DailyInsights} from '../index';
import {DAILY_INSIGHTS_TEST_IDS} from '@constants';

jest.mock('@hooks', () => ({
  useMood: jest.fn(),
  useEvent: jest.fn(() => ({emit: jest.fn()})),
}));

jest.mock('../MoodTrend', () => ({
  MoodTrend: 'MoodTrend',
}));

jest.mock('../MoodAnalytics', () => ({
  MoodAnalytics: 'MoodAnalytics',
}));

describe('DailyInsights', () => {
  const mockMoodEntries = [
    {id: '1', timestamp: new Date(), mood: 'Happy', score: 3},
    {id: '2', timestamp: new Date(), mood: 'Neutral', score: 2},
  ];

  const mockWeeklyMoods = [
    {id: '1', timestamp: new Date(), mood: 'Happy', score: 3},
    {id: '2', timestamp: new Date(), mood: 'Sad', score: 1},
  ];

  const defaultProps = {
    moodEntries: mockMoodEntries,
    weeklyMoods: mockWeeklyMoods,
    addRandomMoods: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useMood as jest.Mock).mockReturnValue(defaultProps);
    (useEvent as jest.Mock).mockImplementation(() => undefined);
  });

  it('renders correctly with initial state', () => {
    const {getByTestId} = render(<DailyInsights />);

    const tasksValue = getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE);
    const moodScoreValue = getByTestId(
      DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE,
    );

    expect(tasksValue).toBeTruthy();
    expect(moodScoreValue).toBeTruthy();
    expect(tasksValue.props.children).not.toBeNull();
    expect(moodScoreValue.props.children).not.toBeNull();
    expect(getByTestId(DAILY_INSIGHTS_TEST_IDS.REFRESH_BUTTON)).toBeTruthy();
    expect(getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_TREND)).toBeTruthy();
    expect(getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS)).toBeTruthy();
  });

  it('calculates mood score correctly', () => {
    const {getByTestId} = render(<DailyInsights />);

    const moodScoreValue = getByTestId(
      DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE,
    );
    expect(moodScoreValue.props.children).toBe(2); // Expected average: (3 + 1) / 2 = 2
  });

  it('generates random tasks between 1 and 10', () => {
    const {getByTestId} = render(<DailyInsights />);

    const tasksValue = Number(
      getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE).props.children,
    );
    expect(tasksValue).toBeGreaterThanOrEqual(1);
    expect(tasksValue).toBeLessThanOrEqual(10);
  });

  it('updates on MOOD_SYNC event', () => {
    let eventHandler: (payload: any) => void;
    (useEvent as jest.Mock).mockImplementation(({handler}) => {
      eventHandler = handler;
    });

    const {getByTestId} = render(<DailyInsights />);
    const initialTasksValue = getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE)
      .props.children;

    act(() => {
      eventHandler({success: true});
    });

    expect(
      getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE).props.children,
    ).not.toBe(initialTasksValue);
  });

  it('handles empty weekly moods', () => {
    (useMood as jest.Mock).mockReturnValue({
      ...defaultProps,
      weeklyMoods: [],
    });

    const {getByTestId} = render(<DailyInsights />);
    expect(
      getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE).props.children,
    ).toBe(0);
  });

  it('passes correct props to child components', () => {
    const {getByTestId} = render(<DailyInsights />);

    const moodTrend = getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_TREND);
    const moodAnalytics = getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS);

    expect(moodTrend.props.data).toBe(mockMoodEntries);
    expect(moodTrend.props.addRandomMoods).toBe(defaultProps.addRandomMoods);
    expect(moodAnalytics.props.data).toBe(mockMoodEntries);
  });
});
