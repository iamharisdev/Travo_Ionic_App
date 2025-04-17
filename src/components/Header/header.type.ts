export interface HeaderProps {
  className?: string;
  translucent?: boolean;
  collapse?: 'condense' | 'fade';
  showBack?: boolean;
  showEdit?: boolean;
  showSave?: boolean;
  selectedLang?: string;
  newLang?: string;
  showMenu?: boolean;
  menuId?: string;
  showCancel?: boolean;
  customBackRoute?: string;
  showDatePicker?: boolean;
  datePickerText?: string;
  leftLabel?: string;
  showNotifications?:boolean;
  showSearchOption?:boolean;
  editCB?: () => void;
  cancelCB?: () => void;
  datePickerCB?: (e: any) => void;
  saveCB?: () => void;
}