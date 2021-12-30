import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiInjectionParamV2 } from '../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.model';

export interface ISpsApiInjectionParamV2State {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiInjectionParamV2[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiInjectionParamV2;
  };
  getInjectionParam: {
    loading: boolean;
    hasErrors: boolean;
    data: any[];
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
