import { useIonToast } from "@ionic/react";

const usePresentToast = () => {
  const [present] = useIonToast();

  const presentToast = (message: string, duration?: number, position?: 'top' | 'middle' | 'bottom', color?: string) => {
    present({
      message,
      duration: duration || 1500,
      position: position || 'top',
      color: color || 'primary',
    });
  };

  return [presentToast];
}

export default usePresentToast;