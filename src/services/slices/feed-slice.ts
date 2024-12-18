import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка';
      });
  },
  selectors: {
    selectFeed: (state) => state,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectOrders: (state) => state.orders
  }
});

export const {
  selectFeed,
  selectTotal,
  selectTotalToday,
  selectIsLoading,
  selectError,
  selectOrders
} = feedSlice.selectors;

export default feedSlice.reducer;
