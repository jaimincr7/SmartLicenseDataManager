import { ISearchWindowsServerOverrides } from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';

export interface IDataTable {
  search?: ISearchWindowsServerOverrides;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
