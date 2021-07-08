import { ISearchAdDevices } from '../../../../services/ad/adDevices/adDevices.model';

export interface IDataTable {
  search?: ISearchAdDevices;
  setSelectedId: (id: number) => void;
}
