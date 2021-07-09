import { IWindowsServerLicenseDetail } from '../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface IWindowsServerLicenseDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerLicenseDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
}
