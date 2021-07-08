import { ISearchSqlServerLicense } from '../../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';

export interface IDataTable {
  search?: ISearchSqlServerLicense;
  setSelectedId: (id: number) => void;
}
