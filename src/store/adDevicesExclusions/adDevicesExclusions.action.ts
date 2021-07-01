import { IBulkInsertDataset } from '../../services/adDevicesExclusions/adDevicesExclusions.model';
import {
  IDeleteDataset,
  IProcessData,
  ISearchAdDevicesExclusions,
  IAdDevicesExclusions,
} from '../../services/adDevicesExclusions/adDevicesExclusions.model';
import adDevicesExclusionsService from '../../services/adDevicesExclusions/adDevicesExclusions.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchAdDevicesExclusions = createAsyncThunk(
  'searchAdDevicesExclusions',
  async (searchParam?: ISearchAdDevicesExclusions) => {
    const response = await adDevicesExclusionsService
      .searchAdDevicesExclusions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getAdDevicesExclusionsById = createAsyncThunk(
  'getAdDevicesExclusionsById',
  async (id: number) => {
    const response = await adDevicesExclusionsService.getAdDevicesExclusionsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveAdDevicesExclusions = createAsyncThunk(
  'saveAdDevicesExclusions',
  async (data: IAdDevicesExclusions) => {
    const response = await adDevicesExclusionsService.saveAdDevicesExclusions(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAdDevicesExclusions = createAsyncThunk(
  'deleteAdDevicesExclusions',
  async (id: number) => {
    const response = await adDevicesExclusionsService.deleteAdDevicesExclusions(id).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteDataset = createAsyncThunk('deleteDataset', async (data: IDeleteDataset) => {
  const response = await adDevicesExclusionsService.deleteDataset(data).then((res) => {
    return res.body;
  });
  return response;
});

export const processData = createAsyncThunk('processData', async (data: IProcessData) => {
  const response = await adDevicesExclusionsService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});

export const getExcelColumns = createAsyncThunk('getExcelColumns', async (data: any) => {
  const response = await adDevicesExclusionsService.getExcelColumns(data).then((res) => {
    return res.body;
  });
  return response.data;
});

export const bulkInsert = createAsyncThunk('bulkInsert', async (data: IBulkInsertDataset) => {
  const response = await adDevicesExclusionsService.bulkInsert(data).then((res) => {
    return res.body;
  });
  return response;
});
