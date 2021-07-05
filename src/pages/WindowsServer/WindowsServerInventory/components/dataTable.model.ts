import { ISearchWindowsServerInventory } from '../../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';

export interface IDataTable {
  search?: ISearchWindowsServerInventory;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
