import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbLicenseModel } from '../../../services/cmdb/licenseModel/licenseModel.model';

export interface ICmdbLicenseModelState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbLicenseModel[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbLicenseModel;
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
