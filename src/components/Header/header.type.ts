export interface HeaderProps {
  className?: string;
  translucent?: boolean;
  collapse?: 'condense' | 'fade';
  showBack?: boolean;
  showEdit?: boolean;
  showMenu?: boolean;
  menuId?: string;
  showCancel?: boolean;
  customBackRoute?: string;
  showDatePicker?: boolean;
  datePickerText?: string;
  leftLabel?: string;
  editCB?: () => void;
  cancelCB?: () => void;
  datePickerCB?: (e: any) => void;
}