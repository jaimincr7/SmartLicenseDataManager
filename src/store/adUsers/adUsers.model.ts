import { IAdUser, IGetExcelColumns } from './../../services/adUsers/adUsers.model';
import { IDropDownOption } from '../../common/models/common';

export interface IAdUsersState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUser[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUser;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getExcelColumns: {
    loading: boolean;
    hasErrors: boolean;
    data: IGetExcelColumns;
  };
  bulkInsert: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
