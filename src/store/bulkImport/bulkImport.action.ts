import {
  IGetExcelMapping,
  IImportDataTable,
  ISaveExcelMapping,
} from './../../services/bulkImport/bulkImport.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import bulkImportService from '../../services/bulkImport/bulkImport.service';
//import { IBulkInsertDataset } from '../../services/common/common.model';
import commonService from '../../services/common/common.service';

// Asynchronous thunk action

export const getTablesForImport = createAsyncThunk('getTablesForImport', async () => {
  const response = await bulkImportService.getTablesForImport().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getTables = createAsyncThunk('getTables', async () => {
  const response = await bulkImportService.getTables().then((res) => {
    return res.body;
  });
  return response.data;
});

export const deleteColumnMapping = createAsyncThunk('deleteColumnMapping', async (id: number) => {
  const response = await bulkImportService.deleteColumnMapping(id).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteFileMapping = createAsyncThunk('deleteFileMapping', async (id: number) => {
  const response = await bulkImportService.deleteFileMapping(id).then((res) => {
    return res.body;
  });
  return response;
});

export const saveTableForImport = createAsyncThunk(
  'saveTableForImport',
  async (data: IImportDataTable) => {
    const response = await bulkImportService.saveTableForImport(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const getTableColumns = createAsyncThunk('getTableColumns', async (tableName: string) => {
  const response = await commonService.getTableColumns(tableName).then((res) => {
    return res;
  });
  return response;
});

export const getExcelColumns = createAsyncThunk('getExcelColumns', async (data: any) => {
  const response = await commonService
    .getExcelColumns(data.file, data.callbackProgress, data.tenantID, data.companyID, data.buID)
    .then((res) => {
      return res.body;
    });
  return response.data;
});

export const getCSVExcelColumns = createAsyncThunk('getCSVExcelColumns', async (file: any) => {
  const response = await commonService.getCSVExcelColumns(file).then((res) => {
    return res.body;
  });
  return response.data;
});

export const bulkInsert = createAsyncThunk('bulkInsert', async (data: any) => {
  const response = await commonService.bulkInsert(data).then((res) => {
    return res.body;
  });
  return response;
});

export const getExcelFileMapping = createAsyncThunk(
  'getExcelFileMapping',
  async (data: IGetExcelMapping) => {
    const response = await bulkImportService.getExcelFileMapping(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const getExcelFileMappingLookup = createAsyncThunk(
  'getExcelFileMappingLookup',
  async (data: any) => {
    const response = await bulkImportService.getExcelFileMappingLookup(data).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveExcelFileMapping = createAsyncThunk(
  'saveExcelFileMapping',
  async (data: ISaveExcelMapping) => {
    const response = await bulkImportService.saveExcelFileMapping(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
