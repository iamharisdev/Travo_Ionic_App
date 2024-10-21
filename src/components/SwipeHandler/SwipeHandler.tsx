import { createGesture } from "@ionic/react";
import { useEffect } from "react";

const SwipeHandler: React.FC<{ parentRef: any }> = ({ parentRef }): null => {

  useEffect(() => {
    if (parentRef && parentRef?.current) {
      const gesture = createGesture({
        el: parentRef.current,
        threshold: 0,
        gestureName: 'swipe',
        // go back priority is 40.
        // higher priority, so, 40.5
        gesturePriority: 40,
        onMove: (ev) => {
          if (ev.deltaX > 0) {
            console.log('swiped to left');
          }
        }
      });

      gesture.enable(true);
    }
  }, [parentRef.current]);

  return null;
}

export default SwipeHandler;