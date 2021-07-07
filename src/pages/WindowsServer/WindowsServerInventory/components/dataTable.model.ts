import { ISearchWindowsServerInventory } from '../../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';

export interface IDataTable {
  search?: ISearchWindowsServerInventory;
  setSelectedId: (id: number) => void;
}
