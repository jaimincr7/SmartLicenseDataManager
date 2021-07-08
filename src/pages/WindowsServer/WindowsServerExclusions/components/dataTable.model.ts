import { ISearchWindowsServerExclusions } from '../../../../services/windowsServer/windowsServerExclusions/windowsServerExclusions.model';

export interface IDataTable {
  search?: ISearchWindowsServerExclusions;
  setSelectedId: (id: number) => void;
}
