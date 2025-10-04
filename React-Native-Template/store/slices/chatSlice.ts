import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/utils/types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentEndpoint: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  currentEndpoint: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Message> }>
    ) => {
      const { id, updates } = action.payload;
      const messageIndex = state.messages.findIndex((msg) => msg.id === id);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...updates,
        };
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentEndpoint: (state, action: PayloadAction<string | null>) => {
      state.currentEndpoint = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  clearMessages,
  setIsLoading,
  setCurrentEndpoint,
} = chatSlice.actions;

export default chatSlice.reducer;
