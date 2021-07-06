import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app.model';
import { IActiveAccount, IUserState } from './user.model';

export const initialState: IUserState = {
  activeAccount: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveAccount: (state, action: PayloadAction<IActiveAccount>) => {
      state.activeAccount = action.payload;
    },
    clearActiveAccount: (state) => {
      state.activeAccount = null;
    },
  },
});

// A selector
export const userSelector = (state: RootState) => state.user;

// Actions
export const { setActiveAccount, clearActiveAccount } = userSlice.actions;

// The reducer
export default userSlice.reducer;
