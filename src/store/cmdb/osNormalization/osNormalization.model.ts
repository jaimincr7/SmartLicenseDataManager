import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbOsNormalization } from '../../../services/cmdb/osNormalization/osNormalization.model';

export interface ICmdbOsNormalizationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbOsNormalization[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbOsNormalization;
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
