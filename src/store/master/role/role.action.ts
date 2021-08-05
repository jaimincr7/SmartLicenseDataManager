import { createAsyncThunk } from '@reduxjs/toolkit';
import { IRole, ISearchRole } from '../../../services/master/role/role.model';
import RoleService from '../../../services/master/role/role.service';
// Asynchronous thunk action

export const searchRole = createAsyncThunk('searchRole', async (searchParam?: ISearchRole) => {
  const response = await RoleService.searchRole(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getRoleById = createAsyncThunk('getRoleById', async (id: number) => {
  const response = await RoleService.getRoleById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveRole = createAsyncThunk('saveRole', async (data: IRole) => {
  const response = await RoleService.saveRole(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteRole = createAsyncThunk('deleteRole', async (id: number) => {
  const response = await RoleService.deleteRole(id).then((res) => {
    return res.body;
  });
  return response;
});
