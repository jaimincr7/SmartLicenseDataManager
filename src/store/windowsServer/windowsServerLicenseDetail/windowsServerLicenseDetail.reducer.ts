import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { searchWindowsServerLicenseDetail } from './windowsServerLicenseDetail.action';
import { IWindowsServerLicenseDetailState } from './windowsServerLicenseDetail.model';
import { IWindowsServerLicenseDetail } from '../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';

export const initialState: IWindowsServerLicenseDetailState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
};

export const windowsServerLicenseDetailSlice = createSlice({
  name: 'windowsServerLicenseDetail',
  initialState,
  reducers: {
    clearWindowsServerLicense: () => {
      return initialState;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerLicenseDetail.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerLicenseDetail.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerLicenseDetail>>
    ) => {
      const { search_result } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
    },
    [searchWindowsServerLicenseDetail.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },
  },
});

// A selector
export const windowsServerLicenseDetailSelector = (state: RootState) =>
  state.windowsServerLicenseDetail;

// Actions
export const { clearWindowsServerLicense } = windowsServerLicenseDetailSlice.actions;

// The reducer
export default windowsServerLicenseDetailSlice.reducer;
