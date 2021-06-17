import { ISearchSqlServer } from '../../../../services/sqlServer/sqlServer.model';

export interface IDataTable {
  search?: ISearchSqlServer;
}

export type fixedColumn = 'right' | 'left';
