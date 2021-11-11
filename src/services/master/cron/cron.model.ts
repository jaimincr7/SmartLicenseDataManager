import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISearchCron extends ISearch {
  is_lookup?: boolean;
}

export interface ICron {
  id?: number;
  name: string;
  url: string;
  group_id: number;
  api_type_id: number;
  sps_input_type_id: number;
  stored_procedure: string;
  enabled: boolean;
  is_mapping?: boolean;
}

export interface ICronData {
  id?: number;
  api_group_id: number;
  company_id: number;
  bu_id: number;
  tenant_id: number;
  cron_frequency_type: string;
  cron_frequency_day: number;
  cron_frequency_time?: string | Moment;
}

export interface ISearchAPI extends ICron {
  group_name: string;
  type_name: string;
}

export interface IStartApi {
  id?: number;
  sps_api_query_param?: {
    [key: string]: any;
  };
}
