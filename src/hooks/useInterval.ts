import { useEffect, useRef } from 'react';

type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null): void {
  const savedCallback = useRef<Callback | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const func = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };
    if (delay !== null) {
      const id: number = setInterval(func, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
