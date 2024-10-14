export interface SwipeProps {
  parentRef: React.MutableRefObject<any>;
  menuId?: string;
  date?: Date;
  onNextWeek?: (newDate: Date) => void;
  onPrevWeek?: (newDate: Date) => void;
}