import {
  ISearchExcelFileMapping,
  IExcelFileMapping,
} from '../../../services/master/excelFileMapping/excelFileMapping.model';
import excelFileMappingService from '../../../services/master/excelFileMapping/excelFileMapping.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchExcelFileMapping = createAsyncThunk(
  'searchExcelFileMapping',
  async (searchParam?: ISearchExcelFileMapping) => {
    const response = await excelFileMappingService
      .searchExcelFileMapping(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getExcelFileMappingById = createAsyncThunk(
  'getExcelFileMappingById',
  async (id: number) => {
    const response = await excelFileMappingService.getExcelFileMappingById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveExcelFileMapping = createAsyncThunk(
  'saveExcelFileMapping',
  async (data: IExcelFileMapping) => {
    const response = await excelFileMappingService.saveExcelFileMapping(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteExcelFileMapping = createAsyncThunk(
  'deleteExcelFileMapping',
  async (id: number) => {
    const response = await excelFileMappingService.deleteExcelFileMapping(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
