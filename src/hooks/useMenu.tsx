import { menuController } from '@ionic/core/components';

interface UseMenu {
  openMenuHandler: (menuId: string) => Promise<void>
  closeMenuHandler: (menuId: string) => Promise<void>
}

const useMenu = (): UseMenu => {
  async function openMenuHandler(menuId: string) {
    await menuController.open(menuId);
  }

  async function closeMenuHandler(menuId: string) {
    await menuController.close(menuId);
  }

  return {
    openMenuHandler,
    closeMenuHandler,
  };
}

export default useMenu;