import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenerateState {
  isGenerating: boolean;
  generatedImage: string | null;
  currentProvider: string | null;
}

const initialState: GenerateState = {
  isGenerating: false,
  generatedImage: null,
  currentProvider: null,
};

export const generateSlice = createSlice({
  name: 'generate',
  initialState,
  reducers: {
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setGeneratedImage: (state, action: PayloadAction<string | null>) => {
      state.generatedImage = action.payload;
    },
    setCurrentProvider: (state, action: PayloadAction<string | null>) => {
      state.currentProvider = action.payload;
    },
    resetGenerate: (state) => {
      state.generatedImage = null;
      state.isGenerating = false;
    },
  },
});

export const {
  setIsGenerating,
  setGeneratedImage,
  setCurrentProvider,
  resetGenerate,
} = generateSlice.actions;

export default generateSlice.reducer;
