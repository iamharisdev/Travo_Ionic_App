import React, { useCallback, useEffect } from 'react';
import { SwipeProps } from './swipeGesture.type';
import { createGesture, GestureDetail } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { menuController } from '@ionic/core/components';
import { APPOINTMENTS, CALENDAR, CALENDAR_DAY, DASHBOARD, FORGOT_PASSWORD, PASSWORD_CHANGED_SUCCESSFULLY, PROFILE, RESET_PASSWORD, SING_IN, VERIFY_EMAIL } from '../../shared/routes/routes';

const SwipeGesture: React.FC<SwipeProps> = ({ parentRef, menuId }): null => {
  const location = useLocation();
  const history = useHistory();

  async function openMenuHandler() {
    await menuController.open(menuId);
  }

  async function closeMenuHandler() {
    await menuController.close(menuId);
  }

  const swipeHandler = useCallback((ev: GestureDetail) => {
    const { pathname } = location;
    // if deltaX > 0 left swip.
    // if deltaX < 0 right swipe.
    if (ev.deltaX > 0) {
      if (
        pathname === APPOINTMENTS ||
        pathname === CALENDAR ||
        pathname === PROFILE ||
        pathname === CALENDAR_DAY
      ) {
        openMenuHandler();
      }

      if (pathname === FORGOT_PASSWORD ||
        pathname === VERIFY_EMAIL ||
        pathname === RESET_PASSWORD ||
        pathname === PASSWORD_CHANGED_SUCCESSFULLY
      ) {
        history.push(SING_IN);
      }
    }

    if (ev.deltaX < 0) {
      if (
        pathname === APPOINTMENTS ||
        pathname === CALENDAR ||
        pathname === PROFILE ||
        pathname === CALENDAR_DAY
      ) {
        closeMenuHandler();
      }
    }
  }, [parentRef.current, location.pathname, history, menuId]);

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
      location.pathname === PASSWORD_CHANGED_SUCCESSFULLY ||
      location.pathname === CALENDAR_DAY
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
  }, [parentRef.current, location.pathname, menuId]);


  return null;
};

export default SwipeGesture;