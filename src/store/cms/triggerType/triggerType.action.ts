import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsTriggerType,
  ISearchCmsTriggerType,
} from '../../../services/cms/triggerType/triggerType.model';
import triggerTypeService from '../../../services/cms/triggerType/triggerType.service';

// Asynchronous thunk action

export const searchCmsTriggerType = createAsyncThunk(
  'searchCmsTriggerType',
  async (searchParam?: ISearchCmsTriggerType) => {
    const response = await triggerTypeService.searchCmsTriggerType(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsTriggerTypeById = createAsyncThunk(
  'getCmsTriggerTypeById',
  async (id: number) => {
    const response = await triggerTypeService.getCmsTriggerTypeById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmsTriggerType = createAsyncThunk(
  'saveCmsTriggerType',
  async (data: ICmsTriggerType) => {
    const response = await triggerTypeService.saveCmsTriggerType(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmsTriggerType = createAsyncThunk('deleteCmsTriggerType', async (id: number) => {
  const response = await triggerTypeService.deleteCmsTriggerType(id).then((res) => {
    return res.body;
  });
  return response;
});
