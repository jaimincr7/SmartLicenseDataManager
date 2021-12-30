import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiTokenConfigOptionsV2 {
  id?: number;
  name: string;
  value: string;
  type: string;
  api_type_ids?: number[];
  is_env_var: boolean;
  sps_api_token_config_options_v2_with_api_types?: any[];
  date_added?: string | Moment;
}

export interface ISearchSpsApiTokenConfigOptionsV2 extends ISearch {
  is_lookup?: boolean;
}
