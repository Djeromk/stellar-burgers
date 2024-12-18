import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredient-slice';
import feedReducer from './slices/feed-slice';
import orderReducer from './slices/order-slice';
import userReducer from './slices/user-slice';
import builderReducer from './slices/constructor-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  builder: builderReducer,
  ingredient: ingredientReducer,
  feed: feedReducer,
  order: orderReducer,
  user: userReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
