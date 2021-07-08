import { ISearchAdDevicesExclusions } from '../../../../services/ad/adDevicesExclusions/adDevicesExclusions.model';

export interface IDataTable {
  search?: ISearchAdDevicesExclusions;
  setSelectedId: (id: number) => void;
}
