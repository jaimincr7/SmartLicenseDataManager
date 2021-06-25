import { IDropDownOption } from '../../common/models/common';
import { ISqlServer } from '../../services/sqlServer/sqlServer.model';

export interface ISqlServerState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServer[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServer;
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
  deleteDataset: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
