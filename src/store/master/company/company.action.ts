import { ICompany, ISearchCompany } from '../../../services/master/company/company.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import companyService from '../../../services/master/company/company.service';

// Asynchronous thunk action

export const searchCompany = createAsyncThunk(
  'searchCompany',
  async (searchParam?: ISearchCompany) => {
    const response = await companyService.searchCompany(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCompanyById = createAsyncThunk('getCompanyById', async (id: number) => {
  const response = await companyService.getCompanyById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const purgeCompanyById = createAsyncThunk('purgeCompanyById', async (id: number) => {
  const response = await companyService.purgeCompanyById(id).then((res) => {
    return res.body;
  });
  return response;
});

export const saveCompany = createAsyncThunk('saveCompany', async (data: ICompany) => {
  const response = await companyService.saveCompany(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCompany = createAsyncThunk('deleteCompany', async (id: number) => {
  const response = await companyService.deleteCompany(id).then((res) => {
    return res.body;
  });
  return response;
});
