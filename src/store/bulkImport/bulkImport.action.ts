import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBulkInsertDataset } from '../../services/common/common.model';
import commonService from '../../services/common/common.service';

// Asynchronous thunk action

export const getDatabaseTables = createAsyncThunk('getDatabaseTables', async () => {
  const response = await commonService.getDatabaseTables().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getTableColumns = createAsyncThunk('getTableColumns', async (tableName: string) => {
  const response = await commonService.getTableColumns(tableName).then((res) => {
    return res;
  });
  return response;
});

export const getExcelColumns = createAsyncThunk('getExcelColumns', async (file: File) => {
  const response = await commonService.getExcelColumns(file).then((res) => {
    return res.body;
  });
  return response.data;
});

export const bulkInsert = createAsyncThunk('bulkInsert', async (data: IBulkInsertDataset) => {
  const response = await commonService.bulkInsert(data).then((res) => {
    return res.body;
  });
  return response;
});
