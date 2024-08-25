import React, { useCallback, useEffect } from 'react';
import { LeftSwipeProps } from './leftSwipeGesture.type';
import { createGesture, GestureDetail } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { APPOINTMENTS, CALENDAR, DASHBOARD, PROFILE } from '../../shared/routes/routes';
import { menuController } from '@ionic/core/components';

const LeftSwipeGesture: React.FC<LeftSwipeProps> = ({ parentRef, menuId }): null => {
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
    }

    if (ev.deltaX < 0) {
      if (
        pathname === APPOINTMENTS ||
        pathname === CALENDAR ||
        pathname === PROFILE
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
      location.pathname === PROFILE
    ) {
      const gesture = createGesture({
        el: parentRef.current,
        threshold: 0,
        gestureName: 'left-swipe',
        gesturePriority: 40.5,
        onMove: swipeHandler
      });

      gesture.enable(true);
    }
  }, [parentRef.current, location.pathname, menuId]);


  return null;
};

export default LeftSwipeGesture;