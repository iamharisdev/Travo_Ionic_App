export interface DatePickerProps {
  dates: Array<string>;
  onSelectedDates: (dates: string[]) => void;
}