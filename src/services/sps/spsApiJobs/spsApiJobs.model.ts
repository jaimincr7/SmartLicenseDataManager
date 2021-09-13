import { Moment } from 'moment';
import { ISearch } from '../../../common/models/common';

export interface ISpsApiJobs {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  date?: string | Moment;
  sps_input_type_id?: number;
  api_call_id?: number;
  api_type_id?: number;
  status?: string;
  call_start?: string | Moment;
  call_end?: string | Moment;
  count?: number;
  api_call_count?: number;
}

export interface ISearchSpsApiJobs extends ISearch {
  is_lookup?: boolean;
}
