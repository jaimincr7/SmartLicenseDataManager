import { booleanLookup } from '../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISearchResponse } from '../../common/models/common';
import { RootState } from '../app.model';
import { searchSqlServerLicenseDetail } from './sqlServerLicenseDetail.action';
import { ISqlServerLicenseDetailState } from './sqlServerLicenseDetail.model';
import { ISqlServerLicenseDetail } from '../../services/sqlServerLicenseDetail/sqlServerLicenseDetail.model';

export const initialState: ISqlServerLicenseDetailState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
};

export const sqlServerLicenseDetailSlice = createSlice({
  name: 'sqlServerLicenseDetail',
  initialState,
  reducers: {
    clearSqlServerLicense: () => {
      return initialState;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerLicenseDetail.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerLicenseDetail.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerLicenseDetail>>
    ) => {
      const { search_result } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
    },
    [searchSqlServerLicenseDetail.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },
  },
});

// A selector
export const sqlServerLicenseDetailSelector = (state: RootState) => state.sqlServerLicenseDetail;

// Actions
export const { clearSqlServerLicense } = sqlServerLicenseDetailSlice.actions;

// The reducer
export default sqlServerLicenseDetailSlice.reducer;
