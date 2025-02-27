import { useCallback, useState } from 'react';
import { SwipeableHandlers, useSwipeable } from 'react-swipeable';

interface UseSwipeGestureProps {
  parentRef: any;
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedDown?: () => void;
  onSwipedUp?: () => void;
}

const UseSwipeGesture = ({
  parentRef,
  onSwipedLeft,
  onSwipedRight,
  onSwipedDown,
  onSwipedUp,
}: UseSwipeGestureProps): {
  handlers: SwipeableHandlers,
  scrollingUpOrDown: boolean,
  tapped: boolean,
  refPassthrough: (el: any) => void
} => {
  const [scrollingUpOrDown, setScrollingUpOrDown] = useState(true);
  const [tapped, setTapped] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft,
    onSwipedRight,
    onSwipedDown,
    onSwipedUp,
    onSwipeStart: (e) => {
      if (e.dir === 'Up' || e.dir === 'Down') {
        setScrollingUpOrDown(true);
        setTapped(false);
      }
    },
    onSwiping: (e) => {
      if (e.dir === 'Up' || e.dir === 'Down') {
        setScrollingUpOrDown(true);
      }
    },
    onSwiped: () => {
      if (scrollingUpOrDown) {
        setScrollingUpOrDown(false);
        setTapped(false);
      }
    },
    onTap: () => {
      setScrollingUpOrDown(false);
      setTapped(true);
      setTimeout(() => setTapped(false), 100);
    },
    delta: {
      up: 10,
      down: 300,
    },
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

  return { handlers, scrollingUpOrDown, tapped, refPassthrough };
};

export default UseSwipeGesture;