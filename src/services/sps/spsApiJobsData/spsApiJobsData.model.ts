import { ISearch } from '../../../common/models/common';

export interface ISpsApiJobsData {
  api_job_id: number;
  json?: string;
  status?: string;
  api_call_start?: Date;
  api_call_end?: Date;
  insert_data_start?: Date;
  processed?: Date;
  count?: number;
  url: string;
}

export interface ISearchSpsApiJobsData extends ISearch {
  api_job_id?: any;
}

export interface ICallAPI {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  sps_api_query_param?: {
    [key: string]: any;
  };
}
