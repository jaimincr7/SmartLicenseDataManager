import { ISearchWindowsServerEntitlements } from '../../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.model';

export interface IDataTable {
  search?: ISearchWindowsServerEntitlements;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
