import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  tier?: string;
  phone?: string;
  credits?: number;
  isVerified: boolean;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export type UserUpdate = Partial<UserData> | PasswordUpdate;

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk pour la connexion
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Décoder le token pour obtenir les informations utilisateur
      const tokenParts = data.token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      return {
        token: data.token,
        user: {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          userName: payload.userName,
          phone: payload.phone || '',
          role: payload.role || 'user',
          tier: payload.tier || 'freemium',
          credits: payload.credits || 0,
          isVerified: payload.isVerified || false
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Une erreur est survenue lors de la connexion');
    }
  }
);

// Async thunk pour la mise à jour du profil
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, updates }: { userId: string, updates: UserUpdate }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}`
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk pour la vérification d'email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/email/confirm/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la vérification');
      }

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Une erreur est survenue lors de la vérification');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Email verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.isVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer; 