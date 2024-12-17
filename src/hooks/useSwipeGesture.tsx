import { useCallback } from 'react';
import { SwipeableHandlers, useSwipeable } from 'react-swipeable';

interface UseSwipeGestureProps {
  parentRef: any;
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedDown?: () => void;
}

const UseSwipeGesture = ({ parentRef, onSwipedLeft, onSwipedRight, onSwipedDown }: UseSwipeGestureProps): { handlers: SwipeableHandlers, refPassthrough: (el: any) => void } => {
  const handlers = useSwipeable({
    onSwipedLeft,
    onSwipedRight,
    onSwipedDown,
    delta: 10,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
    swipeDuration: Infinity,
    touchEventOptions: { passive: true },
  });

  const refPassthrough = useCallback((el: any) => {
    handlers.ref(el);
    parentRef.current = el;
  }, [parentRef]);

  return { handlers, refPassthrough };
};

export default UseSwipeGesture;