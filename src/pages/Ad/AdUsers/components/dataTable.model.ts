import { ISearchAdUsers } from '../../../../services/ad/adUsers/adUsers.model';

export interface IDataTable {
  search?: ISearchAdUsers;
  setSelectedId: (id: number) => void;
}
