import { ISearchAdDevices } from './../../../../services/adDevices/adDevices.model';

export interface IDataTable {
  search?: ISearchAdDevices;
  setSelectedId: (id: number) => void;
}
