import { ISearchAdDevicesExclusions } from './../../../../services/adDevicesExclusions/adDevicesExclusions.model';

export interface IDataTable {
  search?: ISearchAdDevicesExclusions;
  setSelectedId: (id: number) => void;
}
