import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigWindowsServerEditions,
  ISearchConfigWindowsServerEditions,
} from '../../../services/master/windowsServerEditions/windowsServerEditions.model';
import windowsServerEditionsService from '../../../services/master/windowsServerEditions/windowsServerEditions.service';

// Asynchronous thunk action

export const searchConfigWindowsServerEditions = createAsyncThunk(
  'searchConfigWindowsServerEditions',
  async (searchParam?: ISearchConfigWindowsServerEditions) => {
    const response = await windowsServerEditionsService
      .searchConfigWindowsServerEditions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigWindowsServerEditionsById = createAsyncThunk(
  'getConfigWindowsServerEditionsById',
  async (id: number) => {
    const response = await windowsServerEditionsService
      .getConfigWindowsServerEditionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigWindowsServerEditions = createAsyncThunk(
  'saveConfigWindowsServerEditions',
  async (data: IConfigWindowsServerEditions) => {
    const response = await windowsServerEditionsService
      .saveConfigWindowsServerEditions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigWindowsServerEditions = createAsyncThunk(
  'deleteConfigWindowsServerEditions',
  async (id: number) => {
    const response = await windowsServerEditionsService
      .deleteConfigWindowsServerEditions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
