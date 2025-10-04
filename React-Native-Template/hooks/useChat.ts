import { useCallback, useRef } from 'react';
import EventSource, { EventSourceListener } from 'react-native-sse';
import { Alert } from 'react-native';
import { createSecureHeaders } from '@/helpers/api-client';
import { useAuth } from '@/context/FirebaseProvider';
import { Message, SendMessageOptions, UseChatOptions } from '@/utils/types';
import { RootState, useDispatch, useSelector } from '@/store';
import {
  addMessage,
  updateMessage,
  clearMessages,
  setIsLoading,
  setCurrentEndpoint,
} from '@/store/slices/chatSlice';
import { getApiUrl } from '@/helpers/app-functions';

export function useChat({
  endpoint,
  onError,
  onMessageComplete,
}: UseChatOptions) {
  const { user, idToken } = useAuth();
  const userId = user?.uid ?? '';
  const url = getApiUrl();
  const apiUrl = `${url}/${endpoint}`;
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const eventSourceRef = useRef<EventSource | null>(null);

  const addNewMessage = useCallback(
    (message: Partial<Message>) => {
      const timestamp = Date.now();
      const newMessage: Message = {
        id: `${message.isUser ? 'user' : 'ai'}-${timestamp}`,
        text: message.text || '',
        isUser: message.isUser || false,
        isLoading: message.isLoading || false,
      };
      dispatch(addMessage(newMessage));
      return newMessage;
    },
    [dispatch]
  );

  const updateExistingMessage = useCallback(
    (id: string, updates: Partial<Message>) => {
      dispatch(updateMessage({ id, updates }));
    },
    [dispatch]
  );

  const sendMessage = useCallback(
    async ({ message, onProgress }: SendMessageOptions) => {
      if (!message.trim() || isLoading) return;

      // Add user message first
      addNewMessage({
        text: message.trim(),
        isUser: true,
        isLoading: false,
      });

      // Add AI message placeholder
      const aiMessage = addNewMessage({
        text: '',
        isUser: false,
        isLoading: true,
      });

      dispatch(setIsLoading(true));
      dispatch(setCurrentEndpoint(endpoint));

      try {
        // Close any existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // If you want to skip cache, add skipCache to true, like this:
        // const body = { prompt: message, skipCache: true };

        const body = { prompt: message };
        const secureHeaders = await createSecureHeaders(userId, idToken, body);

        eventSourceRef.current = new EventSource(apiUrl, {
          headers: secureHeaders,
          method: 'POST',
          body: JSON.stringify(body),
          lineEndingCharacter: '\n',
        });

        let accumulatedText = '';
        let isFirstChunk = true;

        const messageHandler: EventSourceListener = (event) => {
          if (event.type !== 'message') return;

          const messageEvent = event as unknown as { data: string };
          const data = messageEvent.data;

          if (data === '[DONE]') {
            if (eventSourceRef.current) {
              eventSourceRef.current.removeEventListener(
                'message',
                messageHandler
              );
              eventSourceRef.current.close();
              eventSourceRef.current = null;
            }
            dispatch(setIsLoading(false));
            updateExistingMessage(aiMessage.id, {
              isLoading: false,
              text: accumulatedText || 'No response received',
            });
            onMessageComplete?.();
            return;
          }

          try {
            const parsedData = JSON.parse(data || '');

            if (parsedData.error) {
              if (eventSourceRef.current) {
                eventSourceRef.current.removeEventListener(
                  'message',
                  messageHandler
                );
                eventSourceRef.current.close();
                eventSourceRef.current = null;
              }
              updateExistingMessage(aiMessage.id, {
                text: `Error: ${parsedData.error}`,
                isLoading: false,
              });
              dispatch(setIsLoading(false));
              onError?.(parsedData.error);
              return;
            }

            if (parsedData.content) {
              // For the first chunk, clear loading state
              if (isFirstChunk) {
                updateExistingMessage(aiMessage.id, {
                  text: '',
                  isLoading: false,
                });
                isFirstChunk = false;
              }

              // Update with new content
              accumulatedText += parsedData.content;
              updateExistingMessage(aiMessage.id, {
                text: accumulatedText,
                isLoading: false,
              });

              // Notify progress for scrolling
              onProgress?.(accumulatedText);
            }
          } catch {
            throw new Error('Error parsing SSE data');
          }
        };

        const errorHandler: EventSourceListener = (event) => {
          if (event.type !== 'error') return;

          if (eventSourceRef.current) {
            eventSourceRef.current.removeEventListener(
              'message',
              messageHandler
            );
            eventSourceRef.current.removeEventListener('error', errorHandler);
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          updateExistingMessage(aiMessage.id, {
            text: 'Sorry, I encountered an error. Please try again.',
            isLoading: false,
          });
          dispatch(setIsLoading(false));
          onError?.(event);
          Alert.alert('Error', `Failed to get response from ${endpoint}`);
        };

        eventSourceRef.current.addEventListener('message', messageHandler);
        eventSourceRef.current.addEventListener('error', errorHandler);
      } catch (error) {
        updateExistingMessage(aiMessage.id, {
          text: 'Failed to send message. Please try again.',
          isLoading: false,
        });
        dispatch(setIsLoading(false));
        onError?.(error);
        Alert.alert('Error', 'Failed to send message');
        throw new Error('Error sending message');
      }
    },
    [
      addNewMessage,
      updateExistingMessage,
      isLoading,
      apiUrl,
      endpoint,
      onError,
      onMessageComplete,
      userId,
      idToken,
      dispatch,
    ]
  );

  const clearAllMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const stopGenerating = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      dispatch(setIsLoading(false));

      // Find the last AI message and mark it as complete
      const lastAiMessage = [...messages].reverse().find((msg) => !msg.isUser);
      if (lastAiMessage) {
        updateExistingMessage(lastAiMessage.id, {
          isLoading: false,
          text: lastAiMessage.text || 'Generation stopped.',
        });
      }
    }
  }, [dispatch, messages, updateExistingMessage]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages: clearAllMessages,
    stopGenerating,
  };
}
