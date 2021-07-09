import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchWindowsServerLicenseDetail } from '../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';
import windowsServerLicenseDetailService from '../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.service';

// Asynchronous thunk action

export const searchWindowsServerLicenseDetail = createAsyncThunk(
  'searchWindowsServerLicenseDetail',
  async (searchParam?: ISearchWindowsServerLicenseDetail) => {
    const response = await windowsServerLicenseDetailService
      .searchWindowsServerLicenseDetail(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);
