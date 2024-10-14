import React, { useCallback, useEffect, useState } from 'react';
import { SwipeProps } from './swipeGesture.type';
import { createGesture, GestureDetail } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { menuController } from '@ionic/core/components';
import { APPOINTMENTS, CALENDAR, CALENDAR_DAY, CALENDAR_WEEK, DASHBOARD, FORGOT_PASSWORD, PASSWORD_CHANGED_SUCCESSFULLY, PROFILE, RESET_PASSWORD, SING_IN, VERIFY_EMAIL } from '../../shared/routes/routes';
import { nextWeek, prevWeek } from '../../shared/utils/dates.util';

const SwipeGesture: React.FC<SwipeProps> = ({ parentRef, menuId, date, onNextWeek, onPrevWeek }): null => {
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
        pathname === PROFILE
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

      if (pathname === CALENDAR_WEEK && date && onPrevWeek) {
        // TODO: replace this with a dispatch of an action create date slide in redux toolkit
        onPrevWeek(prevWeek(date));
      }
    }

    if (ev.deltaX < 0) {
      if (
        pathname === APPOINTMENTS ||
        pathname === CALENDAR ||
        pathname === PROFILE
      ) {
        closeMenuHandler();
      }

      if (pathname === CALENDAR_WEEK && date && onNextWeek) {
        // TODO: replace this with a dispatch of an action create date slide in redux toolkit
        onNextWeek(nextWeek(date));
      }
    }
  }, [parentRef.current, location.pathname, history, menuId, date, onNextWeek, onPrevWeek]);

  useEffect(() => {
    if (
      parentRef.current &&
      location.pathname === DASHBOARD ||
      location.pathname === APPOINTMENTS ||
      location.pathname === CALENDAR ||
      location.pathname === CALENDAR_DAY ||
      location.pathname === CALENDAR_WEEK ||
      location.pathname === PROFILE ||
      location.pathname === FORGOT_PASSWORD ||
      location.pathname === VERIFY_EMAIL ||
      location.pathname === RESET_PASSWORD ||
      location.pathname === PASSWORD_CHANGED_SUCCESSFULLY
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
  }, [parentRef.current, location.pathname, menuId, date]);


  return null;
};

export default SwipeGesture;