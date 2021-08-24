import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmsVendor, ISearchCmsVendor } from '../../../services/cms/vendor/vendor.model';
import VendorService from '../../../services/cms/vendor/vendor.service';

// Asynchronous thunk action

export const searchCmsVendor = createAsyncThunk(
  'searchCmsVendor',
  async (searchParam?: ISearchCmsVendor) => {
    const response = await VendorService.searchCmsVendor(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsVendorById = createAsyncThunk('getCmsVendorById', async (id: number) => {
  const response = await VendorService.getCmsVendorById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmsVendor = createAsyncThunk('saveCmsVendor', async (data: ICmsVendor) => {
  const response = await VendorService.saveCmsVendor(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmsVendor = createAsyncThunk('deleteCmsVendor', async (id: number) => {
  const response = await VendorService.deleteCmsVendor(id).then((res) => {
    return res.body;
  });
  return response;
});
