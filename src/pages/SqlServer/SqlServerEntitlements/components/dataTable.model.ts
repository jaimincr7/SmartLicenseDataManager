import { ISearchSqlServerEntitlements } from '../../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.model';

export interface IDataTable {
  search?: ISearchSqlServerEntitlements;
  setSelectedId: (id: number) => void;
}
