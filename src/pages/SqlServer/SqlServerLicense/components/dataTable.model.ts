import { ISearchSqlServerLicense } from '../../../../services/sqlServerLicense/sqlServerLicense.model';

export interface IDataTable {
  search?: ISearchSqlServerLicense;
  setSelectedId: (id: number) => void;
}
