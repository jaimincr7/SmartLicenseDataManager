import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchAdUsers, IAdUser } from '../../../services/ad/adUsers/adUsers.model';
import adUsersService from '../../../services/ad/adUsers/adUsers.service';

// Asynchronous thunk action

export const searchAdUsers = createAsyncThunk(
  'searchAdUsers',
  async (searchParam?: ISearchAdUsers) => {
    const response = await adUsersService.searchAdUsers(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAdUserById = createAsyncThunk('getAdUserById', async (id: number) => {
  const response = await adUsersService.getAdUserById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveAdUser = createAsyncThunk('saveAdUser', async (data: IAdUser) => {
  const response = await adUsersService.saveAdUser(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteAdUser = createAsyncThunk('deleteAdUser', async (id: number) => {
  const response = await adUsersService.deleteAdUser(id).then((res) => {
    return res.body;
  });
  return response;
});
