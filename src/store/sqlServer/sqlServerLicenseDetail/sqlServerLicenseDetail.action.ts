import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchSqlServerLicenseDetail } from '../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.model';
import sqlServerLicenseDetailService from '../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.service';

// Asynchronous thunk action

export const searchSqlServerLicenseDetail = createAsyncThunk(
  'searchSqlServerLicenseDetail',
  async (searchParam?: ISearchSqlServerLicenseDetail) => {
    const response = await sqlServerLicenseDetailService
      .searchSqlServerLicenseDetail(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);
