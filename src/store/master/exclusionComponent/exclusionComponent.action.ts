import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigExclusionComponent,
  ISearchConfigExclusionComponent,
} from '../../../services/master/exclusionComponent/exclusionComponent.model';
import exclusionComponentService from '../../../services/master/exclusionComponent/exclusionComponent.service';

// Asynchronous thunk action

export const searchConfigExclusionComponent = createAsyncThunk(
  'searchConfigExclusionComponent',
  async (searchParam?: ISearchConfigExclusionComponent) => {
    const response = await exclusionComponentService
      .searchConfigExclusionComponent(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigExclusionComponentById = createAsyncThunk(
  'getConfigExclusionComponentById',
  async (id: number) => {
    const response = await exclusionComponentService
      .getConfigExclusionComponentById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigExclusionComponent = createAsyncThunk(
  'saveConfigExclusionComponent',
  async (data: IConfigExclusionComponent) => {
    const response = await exclusionComponentService
      .saveConfigExclusionComponent(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigExclusionComponent = createAsyncThunk(
  'deleteConfigExclusionComponent',
  async (id: number) => {
    const response = await exclusionComponentService
      .deleteConfigExclusionComponent(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
