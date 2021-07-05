import { ISearchSqlServer } from '../../../../services/sqlServer/sqlServer.model';

export interface IDataTable {
  search?: ISearchSqlServer;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
