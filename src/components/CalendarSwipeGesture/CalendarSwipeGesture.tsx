import React, { useEffect, useState } from 'react';
import { createGesture, GestureDetail } from '@ionic/react';
import { CALENDAR_WEEK } from '../../shared/routes/routes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setNextWeek, setPrevWeek } from '../../state/calendarSlice';
import { CalendarSwipeGestureProps } from './calendarSwipeGesture.type';

const CalendarSwipeGesture: React.FC<CalendarSwipeGestureProps> = ({ parentRef }): null => {
  const [updated, setUpdated] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const swipeHandler = (ev: GestureDetail) => {
    const { pathname } = location;
    // if deltaX > 0 left swip.
    // if deltaX < 0 right swipe.
    if (ev.deltaX > 0) {
      if (
        pathname === CALENDAR_WEEK
      ) {
        dispatch(setPrevWeek());
        setUpdated(true);
      }
    }

    if (ev.deltaX < 0) {
      if (
        pathname === CALENDAR_WEEK
      ) {
        dispatch(setNextWeek());
        setUpdated(true);
      }
    }
  };

  useEffect(() => {
    if (
      parentRef.current &&
      location.pathname === CALENDAR_WEEK &&
      !updated
    ) {
      const gesture = createGesture({
        el: parentRef.current,
        threshold: 0,
        gestureName: 'swipe',
        // go back priority is 40.
        // higher priority, so, 40.5
        gesturePriority: 40.5,
        onMove: swipeHandler
      });

      gesture.enable(true);
    }
    if (updated) {
      setTimeout(() => setUpdated(false), 50);
    }
  }, [parentRef.current, location.pathname, updated]);


  return null;
};

export default CalendarSwipeGesture;