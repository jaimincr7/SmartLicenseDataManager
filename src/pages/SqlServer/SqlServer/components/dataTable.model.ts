import { ISearchSqlServer } from '../../../../services/sqlServer/sqlServer.model';

export interface IDataTable {
  search?: ISearchSqlServer;
  setSelectedId: (id: number) => void;
}
