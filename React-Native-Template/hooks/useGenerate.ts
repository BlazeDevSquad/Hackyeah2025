import { useCallback } from 'react';
import { Alert } from 'react-native';
import { z } from 'zod';
import { createSecureHeaders } from '@/helpers/api-client';
import { GenerateOptions, GenerateResult } from '@/utils/types';
import { useAuth } from '@/context/FirebaseProvider';
import { useDispatch, useSelector } from '@/store';
import {
  setIsGenerating,
  setGeneratedImage,
  setCurrentProvider,
  resetGenerate,
} from '@/store/slices/generateSlice';
import { fetch } from 'expo/fetch';
import { getApiUrl } from '@/helpers/app-functions';

// Validation schema
const ImagePromptSchema = z
  .string()
  .min(3, { message: 'Prompt must be at least 3 characters long' });

export const useGenerate = () => {
  const { user, idToken } = useAuth();
  const userId = user?.uid ?? '';
  const url = getApiUrl();

  const dispatch = useDispatch();
  const { isGenerating, generatedImage } = useSelector(
    (state) => state.generate
  );

  const generateImage = useCallback(
    async (prompt: string, options: GenerateOptions) => {
      try {
        dispatch(setIsGenerating(true));
        dispatch(setCurrentProvider(options.provider));

        // Validate prompt
        ImagePromptSchema.parse(prompt);

        const endpoint = `${url}/ai/${options.provider}/generate`;

        // If you want to skip cache, add skipCache to true, like this:
        // const body = { prompt, skipCache: true };
        const body = { prompt };
        const headers = await createSecureHeaders(userId, idToken, body);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        if (response.status !== 200) {
          throw new Error('Image generation failed');
        }

        const data: GenerateResult = await response.json();
        dispatch(setGeneratedImage(data.imageUrl));
        return data.imageUrl;
      } catch (error) {
        if (error instanceof z.ZodError) {
          Alert.alert('Validation Error', error.errors[0].message);
        } else {
          Alert.alert('Error', 'Failed to generate image');
        }
        return null;
      } finally {
        dispatch(setIsGenerating(false));
      }
    },
    [dispatch, url, userId, idToken]
  );

  const reset = useCallback(() => {
    dispatch(resetGenerate());
  }, [dispatch]);

  return {
    generateImage,
    generatedImage,
    isGenerating,
    reset,
  };
};
