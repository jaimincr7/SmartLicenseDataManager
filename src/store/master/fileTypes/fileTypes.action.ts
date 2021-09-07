import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigFileType,
  ISearchConfigFileType,
} from '../../../services/master/fileTypes/fileTypes.model';
import fileTypeService from '../../../services/master/fileTypes/fileTypes.service';

// Asynchronous thunk action

export const searchConfigFileType = createAsyncThunk(
  'searchConfigFileType',
  async (searchParam?: ISearchConfigFileType) => {
    const response = await fileTypeService.searchConfigFileType(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigFileTypeById = createAsyncThunk(
  'getConfigFileTypeById',
  async (id: number) => {
    const response = await fileTypeService.getConfigFileTypeById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigFileType = createAsyncThunk(
  'saveConfigFileType',
  async (data: IConfigFileType) => {
    const response = await fileTypeService.saveConfigFileType(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigFileType = createAsyncThunk('deleteConfigFileType', async (id: number) => {
  const response = await fileTypeService.deleteConfigFileType(id).then((res) => {
    return res.body;
  });
  return response;
});
