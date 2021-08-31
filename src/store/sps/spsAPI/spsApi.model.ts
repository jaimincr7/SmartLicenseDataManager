import { ITableColumnSelection, IDropDownOption } from '../../../common/models/common';
import { ISearchAPI } from '../../../services/sps/spsApi/sps.model';

export interface ISPSApiState {
  tableColumnSelection?: ITableColumnSelection;
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISearchAPI[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  callApi: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
