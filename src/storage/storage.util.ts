import { Preferences } from '@capacitor/preferences';

export const setStorageValue = async (key: string, value: string): Promise<void> => {
  await Preferences.set({
    key,
    value,
  });
};

export const getStorageValue = async (key: string): Promise<string | null> => {
  const { value } = await Preferences.get({ key });

  return value || null;
};

export const removeStorageValue = async (key: string): Promise<void> => {
  await Preferences.remove({ key });
};