export interface DatePickerProps {
  date?: string;
  dates?: Array<string>;
  onSelectedDates?: (dates: string[]) => void;
  onSelectedDate?: (dates: string | undefined) => void;
  onTriggerAction: (dates: string[] | string) => void;
  multiple?: boolean;
}