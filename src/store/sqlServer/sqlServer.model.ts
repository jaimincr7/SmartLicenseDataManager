import { ISqlServer } from '../../services/sqlServer/sqlServer.model';

export interface ISqlServerState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServer[];
    count: number;
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
}
