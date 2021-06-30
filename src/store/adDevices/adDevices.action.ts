import { ISearchAdDevices } from './../../services/adDevices/adDevices.model';
import { IBulkInsertDataset } from './../../services/sqlServer/sqlServer.model';
import {
  IDeleteDataset,
  IProcessData,
  ISearchSqlServer,
  ISqlServer,
} from '../../services/sqlServer/sqlServer.model';
import adDevicesService from '../../services/adDevices/adDevices.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchAdDevices = createAsyncThunk(
  'searchAdDevices',
  async (searchParam?: ISearchAdDevices) => {
    const response = await adDevicesService.searchAdDevices(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

// export const getSqlServerById = createAsyncThunk('getSqlServerById', async (id: number) => {
//   const response = await sqlServerService.getSqlServerById(id).then((res) => {
//     return res.body;
//   });
//   return response.data;
// });

// export const saveSqlServer = createAsyncThunk('saveSqlServer', async (data: ISqlServer) => {
//   const response = await sqlServerService.saveSqlServer(data).then((res) => {
//     return res.body;
//   });
//   return response;
// });

export const deleteAdDevice = createAsyncThunk('deleteAdDevice', async (id: number) => {
  const response = await adDevicesService.deleteAdDevice(id).then((res) => {
    return res.body;
  });
  return response;
});

// export const deleteDataset = createAsyncThunk('deleteDataset', async (data: IDeleteDataset) => {
//   const response = await sqlServerService.deleteDataset(data).then((res) => {
//     return res.body;
//   });
//   return response;
// });

// export const processData = createAsyncThunk('processData', async (data: IProcessData) => {
//   const response = await sqlServerService.processData(data).then((res) => {
//     return res.body;
//   });
//   return response;
// });

// export const getExcelColumns = createAsyncThunk('getExcelColumns', async (data: any) => {
//   const response = await sqlServerService.getExcelColumns(data).then((res) => {
//     return res.body;
//   });
//   return response.data;
// });

// export const bulkInsert = createAsyncThunk('bulkInsert', async (data: IBulkInsertDataset) => {
//   const response = await sqlServerService.bulkInsert(data).then((res) => {
//     return res.body;
//   });
//   return response;
// });
