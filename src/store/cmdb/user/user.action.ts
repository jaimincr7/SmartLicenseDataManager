import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmdbUser, ISearchCmdbUser } from '../../../services/cmdb/user/user.model';
import userService from '../../../services/cmdb/user/user.service';

// Asynchronous thunk action

export const searchCmdbUser = createAsyncThunk(
  'searchCmdbUser',
  async (searchParam?: ISearchCmdbUser) => {
    const response = await userService.searchCmdbUser(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbUserById = createAsyncThunk('getCmdbUserById', async (id: number) => {
  const response = await userService.getCmdbUserById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbUser = createAsyncThunk('saveCmdbUser', async (data: ICmdbUser) => {
  const response = await userService.saveCmdbUser(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmdbUser = createAsyncThunk('deleteCmdbUser', async (id: number) => {
  const response = await userService.deleteCmdbUser(id).then((res) => {
    return res.body;
  });
  return response;
});
