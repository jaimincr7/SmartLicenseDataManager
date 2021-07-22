import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAzureAPIVmSizes } from '../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.model';

export interface IAzureAPIVmSizesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureAPIVmSizes[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureAPIVmSizes;
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
