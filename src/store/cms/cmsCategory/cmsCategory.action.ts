import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsCategory,
  ISearchCmsCategory,
} from '../../../services/cms/cmsCategory/cmsCategory.model';
import cmsCategoryService from '../../../services/cms/cmsCategory/cmsCategory.service';

// Asynchronous thunk action

export const searchCmsCategory = createAsyncThunk(
  'searchCmsCategory',
  async (searchParam?: ISearchCmsCategory) => {
    const response = await cmsCategoryService.searchCmsCategory(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsCategoryById = createAsyncThunk('getCmsCategoryById', async (id: number) => {
  const response = await cmsCategoryService.getCmsCategoryById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmsCategory = createAsyncThunk('saveCmsCategory', async (data: ICmsCategory) => {
  const response = await cmsCategoryService.saveCmsCategory(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmsCategory = createAsyncThunk('deleteCmsCategory', async (id: number) => {
  const response = await cmsCategoryService.deleteCmsCategory(id).then((res) => {
    return res.body;
  });
  return response;
});
