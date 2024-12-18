import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import {
  getUserApi,
  logoutApi,
  loginUserApi,
  registerUserApi,
  updateUserApi
} from '@api';

interface IUserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuth: boolean;
}

const initialState: IUserState = {
  user: {
    name: '',
    email: ''
  },
  isLoading: false,
  error: null,
  isAuthChecked: false,
  isAuth: false
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: { email: string; name: string }) => await updateUserApi(data)
);
export const login = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    const { refreshToken, accessToken, user, success } = response;
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  }
);
export const register = createAsyncThunk(
  'user/register',
  async (data: { email: string; password: string; name: string }) => {
    const response = await registerUserApi(data);
    const { refreshToken, accessToken, user, success } = response;
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  }
);
export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
        state.isAuth = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка';
        state.isAuthChecked = true;
        state.isAuth = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка';
        state.isAuthChecked = true;
        state.isAuth = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
        state.isAuth = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isAuth = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          name: '',
          email: ''
        };
        state.isAuthChecked = true;
        state.isAuth = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка';
      });
  },
  selectors: {
    selectUser: (state) => state,
    selectUserData: (state) => state.user,
    selectUserDataName: (state) => state.user?.name,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuth: (state) => state.isAuth
  }
});
export const {
  selectUser,
  selectUserData,
  selectUserDataName,
  selectIsLoading,
  selectError,
  selectIsAuthChecked,
  selectIsAuth
} = userSlice.selectors;
export default userSlice.reducer;
