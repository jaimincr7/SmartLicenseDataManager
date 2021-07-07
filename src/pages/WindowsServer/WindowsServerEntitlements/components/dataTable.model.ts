import { ISearchWindowsServerEntitlements } from '../../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.model';

export interface IDataTable {
  search?: ISearchWindowsServerEntitlements;
  setSelectedId: (id: number) => void;
}
