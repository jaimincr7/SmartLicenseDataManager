import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbSoftwareNormalization,
  ISearchCmdbSoftwareNormalization,
} from '../../../services/cmdb/softwareNormalization/softwareNormalization.model';
import SoftwareNormalizationService from '../../../services/cmdb/softwareNormalization/softwareNormalization.service';

// Asynchronous thunk action

export const searchCmdbSoftwareNormalization = createAsyncThunk(
  'searchCmdbSoftwareNormalization',
  async (searchParam?: ISearchCmdbSoftwareNormalization) => {
    const response = await SoftwareNormalizationService.searchCmdbSoftwareNormalization(
      searchParam
    ).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbSoftwareNormalizationById = createAsyncThunk(
  'getCmdbSoftwareNormalizationById',
  async (id: number) => {
    const response = await SoftwareNormalizationService.getCmdbSoftwareNormalizationById(id).then(
      (res) => {
        return res.body;
      }
    );
    return response.data;
  }
);

export const saveCmdbSoftwareNormalization = createAsyncThunk(
  'saveCmdbSoftwareNormalization',
  async (data: ICmdbSoftwareNormalization) => {
    const response = await SoftwareNormalizationService.saveCmdbSoftwareNormalization(data).then(
      (res) => {
        return res.body;
      }
    );
    return response;
  }
);

export const deleteCmdbSoftwareNormalization = createAsyncThunk(
  'deleteCmdbSoftwareNormalization',
  async (id: number) => {
    const response = await SoftwareNormalizationService.deleteCmdbSoftwareNormalization(id).then(
      (res) => {
        return res.body;
      }
    );
    return response;
  }
);
