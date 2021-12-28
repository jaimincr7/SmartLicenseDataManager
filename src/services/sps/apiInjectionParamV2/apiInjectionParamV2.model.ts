import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiInjectionParamV2 {
  id?: number;
  param: string;
  param_id: string;
  is_masked: boolean;
  api_type_ids?: number[];
  api_injection_param_v2_with_api_types?: any[];
  date_added?: string | Moment;
}

export interface ISearchSpsApiInjectionParamV2 extends ISearch {
  is_lookup?: boolean;
}
