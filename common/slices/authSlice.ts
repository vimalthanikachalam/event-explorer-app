import { PublicUser } from '@/common/models';
import { forgotPassword as forgotPasswordApi, signIn as signInApi, signUp as signUpApi } from '@/common/services/authService';
import { storage, STORAGE_KEYS } from '@/common/storage/asyncStorage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  user: PublicUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const user = await storage.get(STORAGE_KEYS.user);
  return user || null;
});

export const signIn = createAsyncThunk<PublicUser, { email: string; password: string }, { rejectValue: string }>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signInApi(email, password);
      return user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Sign in failed');
    }
  }
);

export const signUp = createAsyncThunk<PublicUser, { email: string; password: string; displayName?: string }, { rejectValue: string }>(
  'auth/signUp',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await signUpApi(email, password, displayName);
      return user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Sign up failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(email);
      return true;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Failed to send reset email');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<PublicUser | null>) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload as any;
      })
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Sign in failed';
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Sign up failed';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to send reset email';
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
