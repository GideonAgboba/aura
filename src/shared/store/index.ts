/* eslint-disable no-console */
import {createStore} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {useEffect, useState} from 'react';
import {StoreState} from '@types';
import {getFormattedDate} from '@helpers';
import moment from 'moment';

const STORAGE_NAME = 'aura-storage';

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn('Storage setItem failed:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn('Storage removeItem failed:', error);
    }
  },
};

export const store = createStore<StoreState>()(
  persist(
    (set, get) => ({
      // User Profile State & Actions
      user: null,
      setUser: user => set({user, lastSyncTimestamp: new Date()}),
      updateUserSettings: settings =>
        set(state => ({
          user: state.user
            ? {
                ...state.user,
                settings: {...state.user.settings, ...settings},
              }
            : null,
          lastSyncTimestamp: new Date(),
        })),

      // Mood Entries State & Actions
      moodEntries: [],
      setMoodEntries: entries => {
        const {moodEntries} = get();
        set({moodEntries: [...moodEntries, ...entries]});
      },
      addMoodEntry: entry =>
        set(state => {
          const today = new Date();
          const existingEntryIndex = state.moodEntries.findIndex(
            m => m.id === getFormattedDate(today),
          );

          if (existingEntryIndex !== -1) {
            const updatedEntries = [...state.moodEntries];
            updatedEntries[existingEntryIndex] = {
              ...entry,
              id: state.moodEntries[existingEntryIndex].id,
              timestamp: today,
            };
            return {moodEntries: updatedEntries, lastSyncTimestamp: new Date()};
          }

          return {
            moodEntries: [
              ...state.moodEntries,
              {
                ...entry,
                id: getFormattedDate(today),
                timestamp: today,
              },
            ],
            lastSyncTimestamp: new Date(),
          };
        }),
      deleteMoodEntry: id =>
        set(state => ({
          moodEntries: state.moodEntries.filter(entry => entry.id !== id),
          lastSyncTimestamp: new Date(),
        })),
      getMoodEntriesForDateRange: (startDate, endDate) => {
        const {moodEntries} = get();
        return moodEntries.filter(entry => {
          const timestamp = moment(entry.timestamp);
          return timestamp.isBetween(startDate, endDate, null, '[]');
        });
      },

      // App State
      theme: 'system',
      setTheme: theme => set({theme, lastSyncTimestamp: new Date()}),
      resetState: () =>
        set({user: null, moodEntries: [], lastSyncTimestamp: null}),
      lastSyncTimestamp: null,
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() =>
        Platform.OS === 'android' ? storage : AsyncStorage,
      ),
      partialize: state => ({
        user: state.user,
        moodEntries: state.moodEntries,
        lastSyncTimestamp: state.lastSyncTimestamp,
      }),
      version: 1,
    },
  ),
);

export const useStore = () => store.getState();

export const purgeStore = async (): Promise<void> =>
  store.getState().resetState();

export const useStoreHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = store.persist.onFinishHydration(async () => {
      setHydrated(true);
    });

    // Trigger initial hydration
    if (!hydrated) {
      store.persist.rehydrate();
    }

    return () => {
      unsubscribe();
    };
  }, [hydrated]);

  return hydrated;
};
