import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITableColumnSelection } from '../../../common/models/common';
import commonService from '../../../services/common/common.service';
import globalTableColumnSelectionService from '../../../services/administration/globalTableColumnSelection/globalTableColumnSelection.service';

export const getDatabaseTables = createAsyncThunk('getDatabaseTables', async () => {
  const response = await commonService.getDatabaseTables().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getGlobalTableColumns = createAsyncThunk(
  'getGlobalTableColumns',
  async (tableName: string) => {
    const response = await globalTableColumnSelectionService
      .getGlobalTableColumns(tableName)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getTableColumns = createAsyncThunk('getTableColumns', async (tableName: string) => {
  const response = await commonService.getTableColumns(tableName).then((res) => {
    return res;
  });
  return response;
});

export const saveGlobalTableColumnSelection = createAsyncThunk(
  'saveGlobalTableColumnSelection',
  async (data: ITableColumnSelection) => {
    const response = await globalTableColumnSelectionService
      .saveGlobalTableColumnSelection(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
