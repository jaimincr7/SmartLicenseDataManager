import { ISearchAdUsers, IAdUser } from './../../services/adUsers/adUsers.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import adUsersService from '../../services/adUsers/adUsers.service';

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
