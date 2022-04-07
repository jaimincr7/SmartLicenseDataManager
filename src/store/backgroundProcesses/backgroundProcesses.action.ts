import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchBackgroundProcesses } from '../../services/backgroundProcesses/backgroundProcesses.model';
import backgroundProcessesService from '../../services/backgroundProcesses/backgroundProcesses.service';

// Asynchronous thunk action

export const searchBackgroundProcesses = createAsyncThunk(
  'searchBackgroundProcesses',
  async (searchParam?: ISearchBackgroundProcesses) => {
    const response = await backgroundProcessesService
      .searchBackgroundProcesses(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getBackgroundProcessesById = createAsyncThunk(
  'getBackgroundProcessesById',
  async (id: number) => {
    const response = await backgroundProcessesService.getBackgroundProcessesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const deleteBackgroundProcesses = createAsyncThunk(
  'deleteBackgroundProcesses',
  async (id: number) => {
    const response = await backgroundProcessesService.deleteBackgroundProcesses(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
