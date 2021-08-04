import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchUser, IUser } from '../../../services/master/user/users.model';
import UserService from '../../../services/master/user/users.service';
// Asynchronous thunk action

export const searchUser = createAsyncThunk('searchUser', async (searchParam?: ISearchUser) => {
  const response = await UserService.searchUser(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getUserById = createAsyncThunk('getUserById', async (id: number) => {
  const response = await UserService.getUserById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveUser = createAsyncThunk('saveUser', async (data: IUser) => {
  const response = await UserService.saveUser(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteUser = createAsyncThunk('deleteUser', async (id: number) => {
  const response = await UserService.deleteUser(id).then((res) => {
    return res.body;
  });
  return response;
});
