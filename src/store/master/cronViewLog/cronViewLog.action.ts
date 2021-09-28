import { ISearchCron } from '../../../services/master/cron/cron.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import cronViewLogService from '../../../services/master/cronViewLog/cronViewLog.service';

// Asynchronous thunk action

export const searchCronViewLog = createAsyncThunk(
  'searchCronViewLog',
  async (searchParam?: ISearchCron) => {
    const response = await cronViewLogService.searchCronViewLog(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);
