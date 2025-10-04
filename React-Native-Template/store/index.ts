import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import themeReducer from './slices/themeSlice';
import searchReducer from './slices/searchSlice';
import admobReducer from './slices/admobSlice';
import identifierReducer from './slices/identifierSlice';
import chatReducer from './slices/chatSlice';
import generateReducer from './slices/generateSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    search: searchReducer,
    admob: admobReducer,
    identifier: identifierReducer,
    chat: chatReducer,
    generate: generateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
