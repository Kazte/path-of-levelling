import { useEffect, useState } from 'react';

export interface IState {
  name: string;
  on: {
    enter: () => void;
    leave: () => void;
  };
}

export default function useMachine(states: IState[], initialState: string) {
  const [currentState, setCurrentState] = useState<IState>(states[0]);

  const transition = (nextState: string) => {
    const nextStateObject = states.find((state) => state.name === nextState);

    if (!nextStateObject) {
      throw new Error(`Could not find state with name: ${nextState}`);
    }

    currentState.on.leave();
    nextStateObject.on.enter();
    setCurrentState(nextStateObject);
  };

  useEffect(() => {
    const initialStateObject = states.find(
      (state) => state.name === initialState
    );

    if (!initialStateObject) {
      throw new Error(`Could not find state with name: ${initialState}`);
    }

    initialStateObject.on.enter();
    setCurrentState(initialStateObject);
  }, []);

  return { currentState, transition };
}
