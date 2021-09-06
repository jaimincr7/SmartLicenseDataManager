import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigComponentTableColumn,
  ISearchConfigComponentTableColumn,
} from '../../../services/master/componentTableColumn/componentTableColumn.model';
import componentTableColumnService from '../../../services/master/componentTableColumn/componentTableColumn.service';

// Asynchronous thunk action

export const searchConfigComponentTableColumn = createAsyncThunk(
  'searchConfigComponentTableColumn',
  async (searchParam?: ISearchConfigComponentTableColumn) => {
    const response = await componentTableColumnService
      .searchConfigComponentTableColumn(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigComponentTableColumnById = createAsyncThunk(
  'getConfigComponentTableColumnById',
  async (id: number) => {
    const response = await componentTableColumnService
      .getConfigComponentTableColumnById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigComponentTableColumn = createAsyncThunk(
  'saveConfigComponentTableColumn',
  async (data: IConfigComponentTableColumn) => {
    const response = await componentTableColumnService
      .saveConfigComponentTableColumn(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigComponentTableColumn = createAsyncThunk(
  'deleteConfigComponentTableColumn',
  async (id: number) => {
    const response = await componentTableColumnService
      .deleteConfigComponentTableColumn(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
