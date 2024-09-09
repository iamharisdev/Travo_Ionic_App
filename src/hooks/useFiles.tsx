import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";

interface UseFiles {
  takePhoto: () => Promise<File | null>;
  pickPhoto: () => Promise<File | null>;
}

const useFiles = (): UseFiles => {
  const takePhoto = async (): Promise<File | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        width: 500,
        height: 500,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        direction: CameraDirection.Front,
      });
      const byteCharacters = atob(image.base64String || "");
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: image.format });
      const file = new File([blob], `profile-picture.${"jpg"}`, {
        type: `image/${"jpg"}`,
      });

      return file;
    } catch (error) {
      console.error("takePhoto: ", error);
    }

    return null;
  };

  const pickPhoto = async (): Promise<File | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        width: 500,
        height: 500,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });
      const byteCharacters = atob(image.base64String || "");
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: image.format });
      const file = new File([blob], `profile-picture.${"jpg"}`, {
        type: `image/${"jpg"}`,
      });

      return file;
    } catch (error) {
      console.error("pickPhoto: ", error);
    }

    return null;
  };

  return { takePhoto, pickPhoto };
};

export default useFiles;
