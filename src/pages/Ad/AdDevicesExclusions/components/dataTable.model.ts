import { ISearchAdDevicesExclusions } from './../../../../services/adDevicesExclusions/adDevicesExclusions.model';

export interface IDataTable {
  search?: ISearchAdDevicesExclusions;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
