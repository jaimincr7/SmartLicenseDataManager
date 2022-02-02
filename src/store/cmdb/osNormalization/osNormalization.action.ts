import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbOsNormalization,
  ISearchCmdbOsNormalization,
} from '../../../services/cmdb/osNormalization/osNormalization.model';
import OsNormalizationService from '../../../services/cmdb/osNormalization/osNormalization.service';

// Asynchronous thunk action

export const searchCmdbOsNormalization = createAsyncThunk(
  'searchCmdbOsNormalization',
  async (searchParam?: ISearchCmdbOsNormalization) => {
    const response = await OsNormalizationService.searchCmdbOsNormalization(searchParam).then(
      (res) => {
        return res.body;
      }
    );
    return response.data;
  }
);

export const getCmdbOsNormalizationById = createAsyncThunk(
  'getCmdbOsNormalizationById',
  async (id: number) => {
    const response = await OsNormalizationService.getCmdbOsNormalizationById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmdbOsNormalization = createAsyncThunk(
  'saveCmdbOsNormalization',
  async (data: ICmdbOsNormalization) => {
    const response = await OsNormalizationService.saveCmdbOsNormalization(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbOsNormalization = createAsyncThunk(
  'deleteCmdbOsNormalization',
  async (id: number) => {
    const response = await OsNormalizationService.deleteCmdbOsNormalization(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
