import { Device } from "@capacitor/device";

export async function isNative(): Promise<boolean> {
  const info = await Device.getInfo();

  if (info.platform === 'ios' || info.platform === 'android') {
    return true;
  }

  return false;
}