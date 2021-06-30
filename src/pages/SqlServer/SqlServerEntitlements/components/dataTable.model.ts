import { ISearchSqlServerEntitlements } from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';

export interface IDataTable {
  search?: ISearchSqlServerEntitlements;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
