import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiOauthV2 {
  id?: number;
  company_id: number;
  bu_id?: number;
  tenant_id: number;
  api_type_id: number;
  base_url_id?: number;
  consent?: boolean;
  active: boolean;
  api_type_ids?: number[];
  api_injection_param_v2_with_api_types?: any[];
  date_added?: string | Moment;
}

export interface ISearchSpsApiOauthV2 extends ISearch {
  is_lookup?: boolean;
}
