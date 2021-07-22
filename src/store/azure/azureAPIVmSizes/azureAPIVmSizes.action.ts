import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchAzureAPIVmSizes,
  IAzureAPIVmSizes,
} from '../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.model';
import azureAPIVmSizesService from '../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.service';

// Asynchronous thunk action

export const searchAzureAPIVmSizes = createAsyncThunk(
  'searchAzureAPIVmSizes',
  async (searchParam?: ISearchAzureAPIVmSizes) => {
    const response = await azureAPIVmSizesService.searchAzureAPIVmSizes(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAzureAPIVmSizesById = createAsyncThunk(
  'getAzureAPIVmSizesById',
  async (id: number) => {
    const response = await azureAPIVmSizesService.getAzureAPIVmSizesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveAzureAPIVmSizes = createAsyncThunk(
  'saveAzureAPIVmSizes',
  async (data: IAzureAPIVmSizes) => {
    const response = await azureAPIVmSizesService.saveAzureAPIVmSizes(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAzureAPIVmSizes = createAsyncThunk(
  'deleteAzureAPIVmSizes',
  async (id: number) => {
    const response = await azureAPIVmSizesService.deleteAzureAPIVmSizes(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
