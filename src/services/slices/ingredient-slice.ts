import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface IIngredientState {
  ingredients: TIngredient[];
  error: string | null | undefined;
  isIngredientsLoading: boolean;
}

const initialState: IIngredientState = {
  ingredients: [],
  error: null,
  isIngredientsLoading: false
};

export const getIngredients = createAsyncThunk(
  'ingredient/getIngredients',
  async () => await getIngredientsApi()
);

const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = null;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.isIngredientsLoading
  }
});

export const { selectIngredients, selectIngredientsLoading } =
  ingredientSlice.selectors;

export default ingredientSlice.reducer;
