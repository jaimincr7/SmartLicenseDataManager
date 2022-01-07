import { ISearch } from '../../../common/models/common';
import { IGlobalSearch } from '../../../store/globalSearch/globalSearch.model';

export interface ISearchImportAPIs extends ISearch {
  is_lookup?: boolean;
}

export interface ISpsApi {
  is_uid_selection: boolean;
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

export interface ISearchAPI extends ISpsApi {
  group_name: string;
  type_name: string;
}

export interface ICallAPI {
  id: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  oauth_id?: number;
  sps_api_query_param: {
    [key: string]: any;
  };
}

export interface ICallAllApi extends IGlobalSearch {
  keyword?: string;
  filter_keys?: any;
  sps_api_query_param?: {
    [key: string]: any;
  };
}
