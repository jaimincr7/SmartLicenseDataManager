import { ISearchAdDevices } from './../../../../services/adDevices/adDevices.model';

export interface IDataTable {
  search?: ISearchAdDevices;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
