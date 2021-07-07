import { ISearchWindowsServerOverrides } from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';

export interface IDataTable {
  search?: ISearchWindowsServerOverrides;
  setSelectedId: (id: number) => void;
}
