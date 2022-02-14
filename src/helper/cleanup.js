import { useCallback, useRef, useEffect, useState } from "react";

export const useUnmountRef = () => {
  const unmountRef = useRef(false);
  useEffect(
    () => () => {
      unmountRef.current = true;
    },
    []
  );
  return unmountRef;
};

export const useSafeState = (unmountRef, defaultValue) => {
  const [state, changeState] = useState(defaultValue);
  const wrapChangeState = useCallback((v) => {
      if (!unmountRef.current) {
        changeState(v);
      }
    },
    [changeState, unmountRef]
  );
  return [state, wrapChangeState];
};