import { ISearchSqlServerExclusions } from '../../../../services/sqlServerExclusions/sqlServerExclusions.model';

export interface IDataTable {
  search?: ISearchSqlServerExclusions;
  setSelectedId: (id: number) => void;
}
