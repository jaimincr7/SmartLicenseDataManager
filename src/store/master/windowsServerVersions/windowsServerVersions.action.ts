import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigWindowsServerVersions,
  ISearchConfigWindowsServerVersions,
} from '../../../services/master/windowsServerVersions/windowsServerVersions.model';
import windowsServerVersionsService from '../../../services/master/windowsServerVersions/windowsServerVersions.service';

// Asynchronous thunk action

export const searchConfigWindowsServerVersions = createAsyncThunk(
  'searchConfigWindowsServerVersions',
  async (searchParam?: ISearchConfigWindowsServerVersions) => {
    const response = await windowsServerVersionsService
      .searchConfigWindowsServerVersions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigWindowsServerVersionsById = createAsyncThunk(
  'getConfigWindowsServerVersionsById',
  async (id: number) => {
    const response = await windowsServerVersionsService
      .getConfigWindowsServerVersionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigWindowsServerVersions = createAsyncThunk(
  'saveConfigWindowsServerVersions',
  async (data: IConfigWindowsServerVersions) => {
    const response = await windowsServerVersionsService
      .saveConfigWindowsServerVersions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigWindowsServerVersions = createAsyncThunk(
  'deleteConfigWindowsServerVersions',
  async (id: number) => {
    const response = await windowsServerVersionsService
      .deleteConfigWindowsServerVersions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
