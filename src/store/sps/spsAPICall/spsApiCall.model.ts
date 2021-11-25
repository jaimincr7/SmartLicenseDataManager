import { ITableColumnSelection, IDropDownOption } from '../../../common/models/common';
import { ISearchAPI, ISpsApi } from '../../../services/sps/spsApiCall/spsApiCall.model';

export interface ISPSApiCallState {
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
  checkUID: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApi;
  };
  callAllApi: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApi;
  };
}
