import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigLicenseUnits } from '../../../services/master/licenseUnits/licenseUnits.model';

export interface IConfigLicenseUnitsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigLicenseUnits[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigLicenseUnits;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
