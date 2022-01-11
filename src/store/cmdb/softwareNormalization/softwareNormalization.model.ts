import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbSoftwareNormalization } from '../../../services/cmdb/softwareNormalization/softwareNormalization.model';

export interface ICmdbSoftwareNormalizationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbSoftwareNormalization[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbSoftwareNormalization;
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
