import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import * as Application from 'expo-application';
import { getString, setString, STORAGE_KEYS } from '@/utils/storage';

// Get user tracking permission
// This function is important for compliance with privacy regulations
// Dont remove it , because Apple will reject the app if this is not implemented
export const getUserTrackingPermission = async () => {
  if (Platform.OS === 'web') {
    return true;
  }
  const { status } = await requestTrackingPermissionsAsync();
  if (status === 'granted') {
    return true;
  } else {
    return false;
  }
};

// This is for generating a unique device id for the user
// If you are trying to build with Anonymous Sign In, you should use it in RevenueCat
export const getDeviceId = async () => {
  let deviceId = getString(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    if (Platform.OS === 'ios') {
      const iosId = await Application.getIosIdForVendorAsync();
      deviceId = iosId || uuid.v4().toString();
    } else {
      deviceId = Application.getAndroidId() || uuid.v4().toString();
    }
    setString(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
};

// This is for showing a toast message
export const showToast = (message: string, isError = false, color: string) => {
  return Toast.show(message, {
    position: Toast.positions.CENTER,
    backgroundColor: isError ? '#ff0000' : color,
    duration: isError ? Toast.durations.LONG : Toast.durations.SHORT,
    shadow: false,
  });
};

export const handleBack = () => {
  router.back();
};

export const downloadImage = async ({
  generatedImage,
  setIsDownloading,
}: {
  generatedImage: string;
  setIsDownloading: (isDownloading: boolean) => void;
}) => {
  if (!generatedImage) {
    Alert.alert('Error', 'No image to download');
    return;
  }

  try {
    setIsDownloading(true);

    // Request permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant media library permissions to save images'
      );
      return;
    }

    // Generate a unique filename with PNG extension for better quality
    const filename = `shpmblfst-generated-image-${Date.now()}.png`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Download the image with custom headers to ensure full quality
    const downloadResult = await FileSystem.downloadAsync(
      generatedImage,
      fileUri,
      {
        headers: {
          Accept: 'image/png,image/*;q=0.9',
          'Cache-Control': 'no-cache',
        },
        cache: false,
      }
    );

    if (downloadResult.status !== 200) {
      throw new Error('Download failed');
    }

    // Save to media library with maximum quality
    const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
    const album = await MediaLibrary.getAlbumAsync('AI Generated');

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      await MediaLibrary.createAlbumAsync('AI Generated', asset, false);
    }
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download image');
  } finally {
    setIsDownloading(false);
    Alert.alert('Image saved to your gallery!');
  }
};

export function getApiUrl() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // Only handle Android emulator case in development
  if (Platform.OS === 'android' && __DEV__) {
    return apiUrl?.replace('localhost', '10.0.2.2');
  }

  return apiUrl;
}
