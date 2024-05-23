import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [currentState, setCurrentState] = useState(appState.current);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setCurrentState(appState.current);
      // console.log('AppState', appState.current);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return currentState;
};

export default useAppState;
