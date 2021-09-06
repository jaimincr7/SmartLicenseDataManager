import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbProcessor,
  ISearchCmdbProcessor,
} from '../../../services/cmdb/processor/processor.model';
import processorService from '../../../services/cmdb/processor/processor.service';

// Asynchronous thunk action

export const searchCmdbProcessor = createAsyncThunk(
  'searchCmdbProcessor',
  async (searchParam?: ISearchCmdbProcessor) => {
    const response = await processorService.searchCmdbProcessor(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbProcessorById = createAsyncThunk('getCmdbProcessorById', async (id: number) => {
  const response = await processorService.getCmdbProcessorById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbProcessor = createAsyncThunk(
  'saveCmdbProcessor',
  async (data: ICmdbProcessor) => {
    const response = await processorService.saveCmdbProcessor(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbProcessor = createAsyncThunk('deleteCmdbProcessor', async (id: number) => {
  const response = await processorService.deleteCmdbProcessor(id).then((res) => {
    return res.body;
  });
  return response;
});
