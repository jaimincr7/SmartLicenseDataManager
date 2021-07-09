import { ISearchWindowsServerLicense } from '../../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';

export interface IDataTable {
  search?: ISearchWindowsServerLicense;
  setSelectedId: (id: number) => void;
}
