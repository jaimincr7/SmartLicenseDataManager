import { ISearchSqlServerOverrides } from '../../../../services/sqlServerOverrides/sqlServerOverrides.model';

export interface IDataTable {
  search?: ISearchSqlServerOverrides;
  setSelectedId: (id: number) => void;
}
