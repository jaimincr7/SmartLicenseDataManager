import { ISqlServerEntitlements } from '../../services/sqlServerEntitlements/sqlServerEntitlements.model';

export interface ISqlServerEntitlementsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerEntitlements[];
    count: number;
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerEntitlements;
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
