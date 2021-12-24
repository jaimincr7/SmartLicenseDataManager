import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiInjectionParamV2 {
  id?: number;
  param: string;
  param_id: string;
  is_masked: boolean;
  api_type_ids?: number[];
  sps_api_token_config_options_v2_with_api_types?: any[];
  date_added?: string | Moment;
}

export interface ISearchSpsApiInjectionParamV2 extends ISearch {
  is_lookup?: boolean;
}
