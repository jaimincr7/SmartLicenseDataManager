import { ITableColumnSelection, IDropDownOption } from '../../../common/models/common';
import { ISearchAPI, ISpsApi } from '../../../services/sps/spsApi/sps.model';

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
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApi;
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
