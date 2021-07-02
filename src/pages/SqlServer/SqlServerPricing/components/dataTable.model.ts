import { ISearchSqlServerPricing } from '../../../../services/sqlServerPricing/sqlServerPricing.model';

export interface IDataTable {
  search?: ISearchSqlServerPricing;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
