export interface DatePickerProps {
  date?: string;
  onSelectedDate?: (dates: string | undefined) => void;
  onTriggerAction?: (dates: string) => void;
}