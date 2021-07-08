import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchWindowsServerExclusions,
  IWindowsServerExclusions,
} from '../../../services/windowsServer/windowsServerExclusions/windowsServerExclusions.model';
import windowsServerExclusionsService from '../../../services/windowsServer/windowsServerExclusions/windowsServerExclusions.service';

// Asynchronous thunk action

export const searchWindowsServerExclusions = createAsyncThunk(
  'searchWindowsServerExclusions',
  async (searchParam?: ISearchWindowsServerExclusions) => {
    const response = await windowsServerExclusionsService
      .searchWindowsServerExclusions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerExclusionsById = createAsyncThunk(
  'getWindowsServerExclusionsById',
  async (id: number) => {
    const response = await windowsServerExclusionsService
      .getWindowsServerExclusionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerExclusions = createAsyncThunk(
  'saveWindowsServerExclusions',
  async (data: IWindowsServerExclusions) => {
    const response = await windowsServerExclusionsService
      .saveWindowsServerExclusions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerExclusions = createAsyncThunk(
  'deleteWindowsServerExclusions',
  async (id: number) => {
    const response = await windowsServerExclusionsService
      .deleteWindowsServerExclusions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
