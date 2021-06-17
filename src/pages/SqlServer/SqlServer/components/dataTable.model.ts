import { ISearchSqlServer } from '../../../../services/sqlServer/sqlServer.model';

export interface IDataTable {
  search?: ISearchSqlServer;
  setSelectedId: Function;
}

export type fixedColumn = 'right' | 'left';
