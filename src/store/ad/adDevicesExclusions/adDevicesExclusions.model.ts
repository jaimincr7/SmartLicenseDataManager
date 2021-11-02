import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAdDevicesExclusions } from '../../../services/ad/adDevicesExclusions/adDevicesExclusions.model';
import { ILookup } from '../../../services/common/common.model';

export interface IAdDevicesExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevicesExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevicesExclusions;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  fieldLookup: {
    data: ILookup[];
    loading: boolean;
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
