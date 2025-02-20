export interface DatePickerProps {
  date?: string;
  minDate?: string;
  onSelectedDate?: (dates: string | undefined) => void;
  onTriggerAction?: (dates: string) => void;
}