import { ISearchAdUsers } from './../../../../services/adUsers/adUsers.model';

export interface IDataTable {
  search?: ISearchAdUsers;
  setSelectedId: (id: number) => void;
}
