import {useCallback} from 'react';
import {purgeStore, useStore} from '@store';
import {UserProfile} from '@types';

export const useUser = () => {
  const {user, setUser} = useStore();

  const updateUser = useCallback(
    (newUser: UserProfile, callback?: () => void) => {
      setUser(newUser);
      callback && callback();
    },
    [setUser],
  );
  const logout = useCallback((callback = () => {}) => purgeStore().then(callback), []);

  return {user, logout, updateUser};
};
