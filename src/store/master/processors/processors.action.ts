import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigProcessors,
  ISearchConfigProcessors,
} from '../../../services/master/processors/processors.model';
import processorsService from '../../../services/master/processors/processors.service';

// Asynchronous thunk action

export const searchConfigProcessors = createAsyncThunk(
  'searchConfigProcessors',
  async (searchParam?: ISearchConfigProcessors) => {
    const response = await processorsService.searchConfigProcessors(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigProcessorsById = createAsyncThunk(
  'getConfigProcessorsById',
  async (id: number) => {
    const response = await processorsService.getConfigProcessorsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigProcessors = createAsyncThunk(
  'saveConfigProcessors',
  async (data: IConfigProcessors) => {
    const response = await processorsService.saveConfigProcessors(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigProcessors = createAsyncThunk(
  'deleteConfigProcessors',
  async (id: number) => {
    const response = await processorsService.deleteConfigProcessors(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
