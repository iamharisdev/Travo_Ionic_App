import React, { useEffect } from 'react';
import { LeftSwipeProps } from './leftSwipeGesture.type';
import { createGesture } from '@ionic/react';
import { useLocation } from 'react-router';
import { APPOINTMENTS, CALENDAR, DASHBOARD, PROFILE } from '../../shared/routes/routes';

const LeftSwipeGesture: React.FC<LeftSwipeProps> = ({ parentRef }): null => {
  const location = useLocation();

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
        onMove: ev => console.log('left swipe event: ', ev)
      });

      gesture.enable(true);
    }
  }, [parentRef.current]);


  return null;
};

export default LeftSwipeGesture;