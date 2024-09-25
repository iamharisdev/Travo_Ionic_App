export interface DatePickerProps {
  dates: Array<string>;
  onSelectedDates: (dates: string[]) => void;
  onTriggerAction: (dates: string[]) => void;
}