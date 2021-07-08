import { ISearchSqlServerExclusions } from '../../../../services/sqlServer/sqlServerExclusions/sqlServerExclusions.model';

export interface IDataTable {
  search?: ISearchSqlServerExclusions;
  setSelectedId: (id: number) => void;
}
