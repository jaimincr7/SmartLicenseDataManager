import { ISearch } from '../../../common/models/common';

export interface ISearchCronViewLog extends ISearch {
  is_lookup?: boolean;
}

export interface ICronViewLog {
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

export interface ISearchAPI extends ICronViewLog {
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
