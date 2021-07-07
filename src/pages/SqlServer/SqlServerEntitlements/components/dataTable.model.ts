import { ISearchSqlServerEntitlements } from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';

export interface IDataTable {
  search?: ISearchSqlServerEntitlements;
  setSelectedId: (id: number) => void;
}
