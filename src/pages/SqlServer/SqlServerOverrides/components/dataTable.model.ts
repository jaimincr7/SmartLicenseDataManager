import { ISearchSqlServerOverrides } from '../../../../services/sqlServerOverrides/sqlServerOverrides.model';

export interface IDataTable {
  search?: ISearchSqlServerOverrides;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
