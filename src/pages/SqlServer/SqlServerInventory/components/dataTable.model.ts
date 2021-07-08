import { ISearchSqlServerInventory } from '../../../../services/sqlServer/sqlServerInventory/sqlServerInventory.model';

export interface IDataTable {
  search?: ISearchSqlServerInventory;
  setSelectedId: (id: number) => void;
}
