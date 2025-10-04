import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageCompressor } from 'react-native-compressor';
import { useDispatch, useSelector } from '@/store';
import { createSecureHeaders } from '@/helpers/api-client';
import {
  setImage,
  setLoading,
  setResult,
  reset,
} from '@/store/slices/identifierSlice';
import { useAuth } from '@/context/FirebaseProvider';
import { CompressOptions } from '@/utils/types';
import { fetch } from 'expo/fetch';
import { getApiUrl } from '@/helpers/app-functions';

export const useIdentifier = () => {
  const { user, idToken } = useAuth();
  const userId = user?.uid ?? '';
  const url = getApiUrl();
  const endpoint = 'ai/vision';
  const dispatch = useDispatch();
  const { image, loading, result } = useSelector((state) => state.identifier);

  const compressImage = async (uri: string, options: CompressOptions = {}) => {
    const { maxWidth = 1024, maxHeight = 1024, quality = 0.7 } = options;
    return ImageCompressor.compress(uri, {
      maxWidth,
      maxHeight,
      quality,
    });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const compressedUri = await compressImage(result.assets[0].uri);
        dispatch(setImage(compressedUri));
        dispatch(setResult(null));
      }
    } catch {
      throw new Error('Failed to pick an image');
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      const compressedUri = await compressImage(imageUri);
      dispatch(setImage(compressedUri));
      dispatch(setResult(null));
      return compressedUri;
    } catch {
      throw new Error('Failed to process image');
    }
  };

  const identifyImage = async (customPrompt?: string) => {
    if (!image || loading) return;

    dispatch(setLoading(true));
    dispatch(setResult(null));

    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageUrl = `data:image/jpeg;base64,${base64}`;
      const body = {
        imageUrl,
        prompt:
          customPrompt ||
          "You are an AI image analyzer. For any image shared, please: Describe what you see in detail List the main objects/people Note colors and lighting Mention any text visible State the image quality Be clear and specific. If you can't see the image, let me know.",
        // If you want to skip cache, add skipCache to true, like this:
        // skipCache: true,
      };

      const headers = await createSecureHeaders(userId, idToken, body);

      const response = await fetch(`${url}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(setResult(data.response));
      return data.response;
    } catch {
      throw new Error('Failed to identify image');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const clearIdentifier = () => {
    dispatch(reset());
  };

  return {
    image,
    loading,
    result,
    pickImage,
    processImage,
    identifyImage,
    clearIdentifier,
  };
};
