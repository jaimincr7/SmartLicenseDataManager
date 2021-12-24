import {
  ISearchO365Users,
  IO365Users,
  IProcessData,
} from '../../../services/o365/o365Users/o365Users.model';
import o365UsersService from '../../../services/o365/o365Users/o365Users.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365Users = createAsyncThunk(
  'searchO365Users',
  async (searchParam?: ISearchO365Users) => {
    const response = await o365UsersService.searchO365Users(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getO365UsersById = createAsyncThunk('getO365UsersById', async (id: number) => {
  const response = await o365UsersService.getO365UsersById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveO365Users = createAsyncThunk('saveO365Users', async (data: IO365Users) => {
  const response = await o365UsersService.saveO365Users(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteO365Users = createAsyncThunk('deleteO365Users', async (id: number) => {
  const response = await o365UsersService.deleteO365Users(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataO365 = createAsyncThunk('processDataO365', async (data: IProcessData) => {
  const response = await o365UsersService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});
