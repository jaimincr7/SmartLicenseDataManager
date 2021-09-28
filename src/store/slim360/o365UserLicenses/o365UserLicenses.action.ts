import {
  ISearchSlim360O365UserLicenses,
  ISlim360O365UserLicenses,
} from '../../../services/slim360/o365UserLicenses/o365UserLicenses.model';
import o365UserLicensesService from '../../../services/slim360/o365UserLicenses/o365UserLicenses.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSlim360O365UserLicenses = createAsyncThunk(
  'searchSlim360O365UserLicenses',
  async (searchParam?: ISearchSlim360O365UserLicenses) => {
    const response = await o365UserLicensesService
      .searchSlim360O365UserLicenses(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSlim360O365UserLicensesById = createAsyncThunk(
  'getSlim360O365UserLicensesById',
  async (id: number) => {
    const response = await o365UserLicensesService
      .getSlim360O365UserLicensesById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSlim360O365UserLicenses = createAsyncThunk(
  'saveSlim360O365UserLicenses',
  async (data: ISlim360O365UserLicenses) => {
    const response = await o365UserLicensesService.saveSlim360O365UserLicenses(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSlim360O365UserLicenses = createAsyncThunk(
  'deleteSlim360O365UserLicenses',
  async (id: number) => {
    const response = await o365UserLicensesService.deleteSlim360O365UserLicenses(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
