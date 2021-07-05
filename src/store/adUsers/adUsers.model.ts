import { IAdUser } from './../../services/adUsers/adUsers.model';
import { IDropDownOption } from '../../common/models/common';

export interface IAdUsersState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdUser[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
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
}
