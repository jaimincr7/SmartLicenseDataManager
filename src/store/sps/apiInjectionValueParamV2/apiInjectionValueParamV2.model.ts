import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiInjectionValueParamV2 } from '../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.model';

export interface ISpsApiInjectionValueParamV2State {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiInjectionValueParamV2[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiInjectionValueParamV2;
  };
  getByOauthId: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiInjectionValueParamV2[];
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
