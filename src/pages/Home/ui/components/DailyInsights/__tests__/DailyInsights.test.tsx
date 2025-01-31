import {DAILY_INSIGHTS_TEST_IDS} from '@constants';
import {useEvent, useMood, useTheme} from '@hooks';
import {getRandomNumber, toValidNumber} from '@lib';
import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {AppEventType} from '@types';
import {DailyInsights} from '..';

jest.mock('@hooks', () => ({
  useMood: jest.fn(),
  useEvent: jest.fn(),
  useTheme: jest.fn(),
}));

jest.mock('@lib', () => ({
  getRandomNumber: jest.fn(() => 5),
  toValidNumber: jest.fn((value) => (!isNaN(value) ? value : 0)),
}));

jest.mock('../components/MoodTrend', () => ({
  MoodTrend: ({testID, data, addRandomMoods}: any) => (
    <div
      data-testid={testID}
      aria-label="Mood Trend"
      data-moodentries={JSON.stringify(data)}
      data-addrandommoods={typeof addRandomMoods}
    >
      Mood Trend Chart
    </div>
  ),
}));

jest.mock('../components/MoodAnalytics', () => ({
  MoodAnalytics: ({testID, data}: any) => (
    <div data-testid={testID} aria-label="Mood Analytics" data-moodentries={JSON.stringify(data)}>
      Mood Analytics Dashboard
    </div>
  ),
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
    (useMood as jest.Mock).mockReturnValue(defaultProps);
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: 'dark',
      isDark: true,
      toggleTheme: () => {},
    }));
    (getRandomNumber as jest.Mock).mockReturnValue(5);
    (toValidNumber as jest.Mock).mockImplementation((value) => (!isNaN(value) ? value : 0));
  });

  it('renders correctly with initial state', () => {
    render(<DailyInsights />);

    expect(screen.getByText(/daily insights/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks completed/i)).toBeInTheDocument();
    expect(screen.getByText(/mood score/i)).toBeInTheDocument();
    expect(screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.REFRESH_BUTTON)).toBeInTheDocument();
    expect(screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_TREND)).toBeInTheDocument();
    expect(screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS)).toBeInTheDocument();
  });

  it('calculates mood score correctly', async () => {
    render(<DailyInsights />);

    const moodScoreValue = screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE);
    expect(Number(moodScoreValue.textContent)).toBe(2);
  });

  it('shows correct number of tasks', () => {
    render(<DailyInsights />);

    const tasksValue = screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE);
    expect(Number(tasksValue.textContent)).toBe(5);
  });

  it('handles empty weekly moods', () => {
    (useMood as jest.Mock).mockReturnValue({
      ...defaultProps,
      weeklyMoods: [],
    });

    render(<DailyInsights />);

    const moodScoreValue = screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE);
    expect(Number(moodScoreValue.textContent)).toBe(0);
  });

  it('updates mood score when weekly moods change', () => {
    const {rerender} = render(<DailyInsights />);
    const mockDate = new Date();
    const newWeeklyMoods = [
      {id: '1', timestamp: mockDate, mood: 'Happy', score: 4},
      {id: '2', timestamp: mockDate, mood: 'Happy', score: 4},
    ];

    (useMood as jest.Mock).mockReturnValue({
      ...defaultProps,
      weeklyMoods: newWeeklyMoods,
    });

    rerender(<DailyInsights />);

    const moodScoreValue = screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE);
    expect(Number(moodScoreValue.textContent)).toBe(4);
  });

  it('registers event handler with correct event type', () => {
    render(<DailyInsights />);

    expect(useEvent).toHaveBeenCalledWith({
      eventType: AppEventType.MOOD_SYNC,
      handler: expect.any(Function),
    });
  });

  it('handles MOOD_SYNC event', () => {
    let eventHandler: (payload: any) => void;
    (useEvent as jest.Mock).mockImplementation(({handler}) => {
      eventHandler = handler;
    });

    render(<DailyInsights />);

    act(() => {
      eventHandler({success: true});
    });

    const tasksValue = screen.getByTestId(DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE);
    expect(Number(tasksValue.textContent)).toBe(5);
  });
});
