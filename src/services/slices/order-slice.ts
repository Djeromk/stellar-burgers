import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface IOrderState {
  data: TOrder[];
  isOrderLoading: boolean;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  data: [],
  isOrderLoading: false,
  orderModalData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  { order: TOrder; success: boolean },
  string[]
>('order/create', async (data) => await orderBurgerApi(data));

export const getOrder = createAsyncThunk<TOrder, number>(
  'order/getOrder',
  async (id) => {
    const response = await getOrderByNumberApi(id);
    return response.orders[0];
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => await getOrdersApi()
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(getOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Ошибка при получении заказа';
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при получении заказов';
      });
  },
  selectors: {
    selectOrder: (state) => state,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsOrderLoading: (state) => state.isOrderLoading,
    selectOrderError: (state) => state.error,
    selectIsLoading: (state) => state.isLoading,
    selectOrdersData: (state) => state.data
  }
});
export const {
  selectOrder,
  selectOrderModalData,
  selectOrderRequest,
  selectIsOrderLoading,
  selectOrderError,
  selectIsLoading,
  selectOrdersData
} = orderSlice.selectors;
export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
