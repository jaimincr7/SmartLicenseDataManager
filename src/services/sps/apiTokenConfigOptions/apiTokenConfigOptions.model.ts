import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiTokenConfigOptions {
  id?: number;
  name: string;
  value: string;
  type: string;
  api_type_id?: number;
  is_env_var: boolean;
  date_added?: string | Moment;
}

export interface ISearchSpsApiTokenConfigOptions extends ISearch {
  is_lookup?: boolean;
}
