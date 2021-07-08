import { ISearchSqlServerOverrides } from '../../../../services/sqlServer/sqlServerOverrides/sqlServerOverrides.model';

export interface IDataTable {
  search?: ISearchSqlServerOverrides;
  setSelectedId: (id: number) => void;
}
