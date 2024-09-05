import React, { useCallback, useEffect } from 'react';
import { LeftSwipeProps } from './leftSwipeGesture.type';
import { createGesture, GestureDetail } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { APPOINTMENTS, CALENDAR, DASHBOARD, FORGOT_PASSWORD, PASSWORD_CHANGED_SUCCESSFULLY, PROFILE, RESET_PASSWORD, SING_IN, VERIFY_EMAIL } from '../../shared/routes/routes';

const LeftSwipeGesture: React.FC<LeftSwipeProps> = ({ parentRef }): null => {
  const location = useLocation();
  const history = useHistory();


  const swipeHandler = useCallback((ev: GestureDetail) => {
    const { pathname } = location;
    // if deltaX > 0 left swip.
    // if deltaX < 0 right swipe.
    if (ev.deltaX > 0) {
      if (
        pathname === FORGOT_PASSWORD ||
        pathname === VERIFY_EMAIL ||
        pathname === RESET_PASSWORD ||
        pathname === PASSWORD_CHANGED_SUCCESSFULLY
      ) {
        history.push(SING_IN);
      }
    }
  }, [parentRef.current, location.pathname, history]);

  useEffect(() => {
    if (
      parentRef.current &&
      location.pathname === DASHBOARD ||
      location.pathname === APPOINTMENTS ||
      location.pathname === CALENDAR ||
      location.pathname === PROFILE ||
      location.pathname === FORGOT_PASSWORD ||
      location.pathname === VERIFY_EMAIL ||
      location.pathname === RESET_PASSWORD ||
      location.pathname === PASSWORD_CHANGED_SUCCESSFULLY
    ) {
      const gesture = createGesture({
        el: parentRef.current,
        threshold: 0,
        gestureName: 'left-swipe',
        // go back priority is 40.
        // higher priority, so, 40.5
        gesturePriority: 40.5,
        onMove: swipeHandler,
      });

      gesture.enable(true);
    }
  }, [parentRef.current, location.pathname]);


  return null;
};

export default LeftSwipeGesture;