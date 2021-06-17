import { ISearchSqlServerEntitlements } from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';

export interface IDataTable {
  search?: ISearchSqlServerEntitlements;
}

export type fixedColumn = 'right' | 'left';
