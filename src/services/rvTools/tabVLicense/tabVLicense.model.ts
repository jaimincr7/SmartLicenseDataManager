import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ITabVLicense {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  date_added?: string | Moment;
  source?: string;
  name?: string;
  key?: string;
  labels?: string;
  cost_unit?: string;
  total?: number;
  used?: number;
  expiration_date?: string;
  features?: string;
  vi_sdk_server?: string;
  vi_sdk_uuid?: string;
}

export interface ISearchTabVLicense extends ISearch {
  is_lookup?: boolean;
}
