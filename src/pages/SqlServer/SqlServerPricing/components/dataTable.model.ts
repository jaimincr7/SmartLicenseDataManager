import { ISearchSqlServerPricing } from '../../../../services/sqlServerPricing/sqlServerPricing.model';

export interface IDataTable {
  search?: ISearchSqlServerPricing;
  setSelectedId: (id: number) => void;
}
