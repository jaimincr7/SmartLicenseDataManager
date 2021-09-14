import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigFileCategories,
  ISearchConfigFileCategories,
} from '../../../services/master/fileCategories/fileCategories.model';
import fileCategoriesService from '../../../services/master/fileCategories/fileCategories.service';

// Asynchronous thunk action

export const searchConfigFileCategories = createAsyncThunk(
  'searchConfigFileCategories',
  async (searchParam?: ISearchConfigFileCategories) => {
    const response = await fileCategoriesService
      .searchConfigFileCategories(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigFileCategoriesById = createAsyncThunk(
  'getConfigFileCategoriesById',
  async (id: number) => {
    const response = await fileCategoriesService.getConfigFileCategoriesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigFileCategories = createAsyncThunk(
  'saveConfigFileCategories',
  async (data: IConfigFileCategories) => {
    const response = await fileCategoriesService.saveConfigFileCategories(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigFileCategories = createAsyncThunk(
  'deleteConfigFileCategories',
  async (id: number) => {
    const response = await fileCategoriesService.deleteConfigFileCategories(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
