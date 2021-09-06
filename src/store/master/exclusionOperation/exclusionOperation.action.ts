import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigExclusionOperation,
  ISearchConfigExclusionOperation,
} from '../../../services/master/exclusionOperation/exclusionOperation.model';
import exclusionOperationService from '../../../services/master/exclusionOperation/exclusionOperation.service';

// Asynchronous thunk action

export const searchConfigExclusionOperation = createAsyncThunk(
  'searchConfigExclusionOperation',
  async (searchParam?: ISearchConfigExclusionOperation) => {
    const response = await exclusionOperationService
      .searchConfigExclusionOperation(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigExclusionOperationById = createAsyncThunk(
  'getConfigExclusionOperationById',
  async (id: number) => {
    const response = await exclusionOperationService
      .getConfigExclusionOperationById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigExclusionOperation = createAsyncThunk(
  'saveConfigExclusionOperation',
  async (data: IConfigExclusionOperation) => {
    const response = await exclusionOperationService
      .saveConfigExclusionOperation(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigExclusionOperation = createAsyncThunk(
  'deleteConfigExclusionOperation',
  async (id: number) => {
    const response = await exclusionOperationService
      .deleteConfigExclusionOperation(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
