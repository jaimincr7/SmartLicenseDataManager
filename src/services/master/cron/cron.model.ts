import { ISearch } from '../../../common/models/common';
import { IGlobalSearch } from '../../../store/globalSearch/globalSearch.model';

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

export interface ISearchAPI extends ICron {
  group_name: string;
  type_name: string;
}

export interface IStartApi {
  id?: number;
  formula_id: number;
  sps_api_query_param?: {
    [key: string]: any;
  };
}
