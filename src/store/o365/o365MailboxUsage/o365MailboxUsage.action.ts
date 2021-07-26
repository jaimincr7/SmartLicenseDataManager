import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IO365MailboxUsage,
  ISearchO365MailboxUsage,
} from '../../../services/o365/o365MailboxUsage/o365MailboxUsage.model';
import mailBoxUsageService from '../../../services/o365/o365MailboxUsage/o365MailboxUsage.service';

export const searchO365MailboxUsage = createAsyncThunk(
  'searchO365MailboxUsage',
  async (searchParam?: ISearchO365MailboxUsage) => {
    const response = await mailBoxUsageService.searchO365MailboxUsage(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getO365MailboxUsageById = createAsyncThunk(
  'getO365MailboxUsageById',
  async (id: number) => {
    const response = await mailBoxUsageService.getO365MailboxUsageById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365MailboxUsage = createAsyncThunk(
  'saveO365MailboxUsage',
  async (data: IO365MailboxUsage) => {
    const response = await mailBoxUsageService.saveO365MailboxUsage(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365MailboxUsage = createAsyncThunk(
  'deleteO365MailboxUsage',
  async (id: number) => {
    const response = await mailBoxUsageService.deleteO365MailboxUsage(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
