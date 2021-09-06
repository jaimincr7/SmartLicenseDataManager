import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigExclusionType,
  ISearchConfigExclusionType,
} from '../../../services/master/exclusionType/exclusionType.model';
import exclusionTypeService from '../../../services/master/exclusionType/exclusionType.service';

// Asynchronous thunk action

export const searchConfigExclusionType = createAsyncThunk(
  'searchConfigExclusionType',
  async (searchParam?: ISearchConfigExclusionType) => {
    const response = await exclusionTypeService
      .searchConfigExclusionType(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigExclusionTypeById = createAsyncThunk(
  'getConfigExclusionTypeById',
  async (id: number) => {
    const response = await exclusionTypeService.getConfigExclusionTypeById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigExclusionType = createAsyncThunk(
  'saveConfigExclusionType',
  async (data: IConfigExclusionType) => {
    const response = await exclusionTypeService.saveConfigExclusionType(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigExclusionType = createAsyncThunk(
  'deleteConfigExclusionType',
  async (id: number) => {
    const response = await exclusionTypeService.deleteConfigExclusionType(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
