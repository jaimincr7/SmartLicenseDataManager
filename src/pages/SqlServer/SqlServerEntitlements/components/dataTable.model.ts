import { ISearchSqlServerEntitlements } from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';

export interface IDataTable {
  search?: ISearchSqlServerEntitlements;
  setSelectedId: Function;
}

export type fixedColumn = 'right' | 'left';
