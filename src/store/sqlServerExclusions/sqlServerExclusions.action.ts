import {
  ISearchSqlServerExclusions,
  ISqlServerExclusions,
} from '../../services/sqlServerExclusions/sqlServerExclusions.model';
import sqlServerExclusionsService from '../../services/sqlServerExclusions/sqlServerExclusions.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSqlServerExclusions = createAsyncThunk(
  'searchSqlServerExclusions',
  async (searchParam?: ISearchSqlServerExclusions) => {
    const response = await sqlServerExclusionsService
      .searchSqlServerExclusions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSqlServerExclusionsById = createAsyncThunk(
  'getSqlServerExclusionsById',
  async (id: number) => {
    const response = await sqlServerExclusionsService.getSqlServerExclusionsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSqlServerExclusions = createAsyncThunk(
  'saveSqlServerExclusions',
  async (data: ISqlServerExclusions) => {
    const response = await sqlServerExclusionsService.saveSqlServerExclusions(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSqlServerExclusions = createAsyncThunk(
  'deleteSqlServerExclusions',
  async (id: number) => {
    const response = await sqlServerExclusionsService.deleteSqlServerExclusions(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
