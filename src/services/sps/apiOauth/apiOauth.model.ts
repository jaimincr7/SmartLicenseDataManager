import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiOauth {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  uid?: string;
  consent?: boolean;
  active?: boolean;
  api_type_id?: number;
  token?: string;
  url_base?: string;
  base_url_id?: number;
  is_masked: boolean;
  date_added?: string | Moment;
}

export interface ISearchSpsApiOauth extends ISearch {
  is_lookup?: boolean;
}
