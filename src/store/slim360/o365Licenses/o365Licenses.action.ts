import {
  ISearchSlim360O365Licenses,
  ISlim360O365Licenses,
} from '../../../services/slim360/o365Licenses/o365Licenses.model';
import o365LicensesService from '../../../services/slim360/o365Licenses/o365Licenses.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSlim360O365Licenses = createAsyncThunk(
  'searchSlim360O365Licenses',
  async (searchParam?: ISearchSlim360O365Licenses) => {
    const response = await o365LicensesService
      .searchSlim360O365Licenses(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSlim360O365LicensesById = createAsyncThunk(
  'getSlim360O365LicensesById',
  async (id: number) => {
    const response = await o365LicensesService.getSlim360O365LicensesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSlim360O365Licenses = createAsyncThunk(
  'saveSlim360O365Licenses',
  async (data: ISlim360O365Licenses) => {
    const response = await o365LicensesService.saveSlim360O365Licenses(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSlim360O365Licenses = createAsyncThunk(
  'deleteSlim360O365Licenses',
  async (id: number) => {
    const response = await o365LicensesService.deleteSlim360O365Licenses(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
