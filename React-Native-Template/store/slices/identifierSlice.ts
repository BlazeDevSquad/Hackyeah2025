import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IdentifierState {
  image: string | null;
  result: string | null;
  loading: boolean;
  showCamera: boolean;
}

const initialState: IdentifierState = {
  image: null,
  result: null,
  loading: false,
  showCamera: false,
};

const identifierSlice = createSlice({
  name: 'identifier',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
      if (action.payload === null) {
        state.result = null;
      }
    },
    setResult: (state, action: PayloadAction<string | null>) => {
      state.result = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowCamera: (state, action: PayloadAction<boolean>) => {
      state.showCamera = action.payload;
    },
    reset: (state) => {
      state.image = null;
      state.result = null;
      state.loading = false;
      state.showCamera = false;
    },
  },
});

export const { setImage, setResult, setLoading, setShowCamera, reset } =
  identifierSlice.actions;
export default identifierSlice.reducer;
