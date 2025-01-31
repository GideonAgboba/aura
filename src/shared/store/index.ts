import moment from 'moment';
import {createStore} from 'zustand';
import {persist} from 'zustand/middleware';
import {useEffect, useState} from 'react';
import {getFormattedDate} from '@lib';
import {StoreState} from '@types';

const STORAGE_NAME = 'aura-storage';

export const store = createStore<StoreState>()(
  persist(
    (set, get) => ({
      // User Profile State & Actions
      user: null,
      setUser: (user) => set({user, lastSyncTimestamp: new Date()}),
      updateUserSettings: (settings) =>
        set((state) => ({
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
      setMoodEntries: (entries) => {
        const {moodEntries} = get();
        set({moodEntries: [...moodEntries, ...entries]});
      },
      addMoodEntry: (entry) =>
        set((state) => {
          const today = new Date();
          const existingEntryIndex = state.moodEntries.findIndex(
            (m) => m.id === getFormattedDate(today),
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
      deleteMoodEntry: (id) =>
        set((state) => ({
          moodEntries: state.moodEntries.filter((entry) => entry.id !== id),
          lastSyncTimestamp: new Date(),
        })),
      getMoodEntriesForDateRange: (startDate, endDate) => {
        const {moodEntries} = get();
        return moodEntries.filter((entry) => {
          const timestamp = moment(entry.timestamp);
          return timestamp.isBetween(startDate, endDate, null, '[]');
        });
      },

      // App State
      theme: 'system',
      setTheme: (theme) => set({theme, lastSyncTimestamp: new Date()}),
      resetState: () => set({user: null, moodEntries: [], lastSyncTimestamp: null}),
      lastSyncTimestamp: null,
    }),
    {
      name: STORAGE_NAME,
      partialize: (state) => ({
        user: state.user,
        moodEntries: state.moodEntries,
        lastSyncTimestamp: state.lastSyncTimestamp,
      }),
      version: 1,
    },
  ),
);

export const useStore = () => store.getState();

export const purgeStore = async (): Promise<void> => store.getState().resetState();

export const useStoreHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = store.persist.onFinishHydration(async () => {
      setTimeout(() => {
        setHydrated(true);
      }, 2500); // Little delay
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
