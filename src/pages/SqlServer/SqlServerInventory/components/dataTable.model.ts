import { ISearchSqlServerInventory } from '../../../../services/sqlServerInventory/sqlServerInventory.model';

export interface IDataTable {
  search?: ISearchSqlServerInventory;
  setSelectedId: (id: number) => void;
}
