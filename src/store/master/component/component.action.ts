import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigComponent,
  ISearchConfigComponent,
} from '../../../services/master/component/component.model';
import componentService from '../../../services/master/component/component.service';

// Asynchronous thunk action

export const searchConfigComponent = createAsyncThunk(
  'searchConfigComponent',
  async (searchParam?: ISearchConfigComponent) => {
    const response = await componentService.searchConfigComponent(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigComponentById = createAsyncThunk(
  'getConfigComponentById',
  async (id: number) => {
    const response = await componentService.getConfigComponentById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigComponent = createAsyncThunk(
  'saveConfigComponent',
  async (data: IConfigComponent) => {
    const response = await componentService.saveConfigComponent(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigComponent = createAsyncThunk(
  'deleteConfigComponent',
  async (id: number) => {
    const response = await componentService.deleteConfigComponent(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
