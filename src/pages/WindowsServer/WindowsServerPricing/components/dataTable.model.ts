import { ISearchSqlServerPricing } from '../../../../services/sqlServer/sqlServerPricing/sqlServerPricing.model';

export interface IDataTable {
  search?: ISearchSqlServerPricing;
  setSelectedId: (id: number) => void;
}
