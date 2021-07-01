import { ISearchAdUsers } from './../../../../services/adUsers/adUsers.model';

export interface IDataTable {
  search?: ISearchAdUsers;
  setSelectedId: (id: number) => void;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
