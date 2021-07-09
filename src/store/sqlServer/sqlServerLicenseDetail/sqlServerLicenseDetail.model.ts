import { ISqlServerLicenseDetail } from '../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ISqlServerLicenseDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerLicenseDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
}
