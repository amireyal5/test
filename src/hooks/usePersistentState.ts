import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      window.localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error(error);
    }
  }, [key, state]);

  return [state, setState];
}