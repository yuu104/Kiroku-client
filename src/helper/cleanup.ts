import {
  useCallback,
  useRef,
  useEffect,
  useState,
  MutableRefObject,
} from 'react'

export const useUnmountRef = () => {
  const unmountRef = useRef(false)
  useEffect(
    () => () => {
      unmountRef.current = true
    },
    []
  )
  return unmountRef
}

export const useSafeState = (
  unmountRef: MutableRefObject<boolean>,
  defaultValue: boolean | []
) => {
  const [state, changeState] = useState<boolean | []>(defaultValue)
  const wrapChangeState = useCallback(
    (v: boolean | []) => {
      if (!unmountRef.current) {
        changeState(v)
      }
    },
    [changeState, unmountRef]
  )
  return [state, wrapChangeState]
}
