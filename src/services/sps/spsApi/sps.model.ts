import { ISearch } from '../../../common/models/common';
import { IGlobalSearch } from '../../../store/globalSearch/globalSearch.model';

export interface ISearchImportAPIs extends ISearch {
  is_lookup?: boolean;
}

export interface ISearchAPI {
  id?: number;
  name: string;
  url: string;
  group_id: number;
  api_type_id: number;
  sps_input_type_id: number;
  stored_procedure: string;
  enabled: boolean;
  group_name: string;
  type_name: string;
}

export interface ICallAPI {
  id: number;
  company_id: number;
  bu_id: number;
  tenant_id: number;
  spsApiQueryParam: {
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
