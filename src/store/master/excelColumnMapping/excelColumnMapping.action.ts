import {
  ISearchExcelColumnMapping,
  IExcelColumnMapping,
} from '../../../services/master/excelColumnMapping/excelColumnMapping.model';
import excelColumnMappingService from '../../../services/master/excelColumnMapping/excelColumnMapping.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchExcelColumnMapping = createAsyncThunk(
  'searchExcelColumnMapping',
  async (searchParam?: ISearchExcelColumnMapping) => {
    const response = await excelColumnMappingService
      .searchExcelColumnMapping(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getExcelColumnMappingById = createAsyncThunk(
  'getExcelColumnMappingById',
  async (id: number) => {
    const response = await excelColumnMappingService.getExcelColumnMappingById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveExcelColumnMapping = createAsyncThunk(
  'saveExcelColumnMapping',
  async (data: IExcelColumnMapping) => {
    const response = await excelColumnMappingService.saveExcelColumnMapping(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteExcelColumnMapping = createAsyncThunk(
  'deleteExcelColumnMapping',
  async (id: number) => {
    const response = await excelColumnMappingService.deleteExcelColumnMapping(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
