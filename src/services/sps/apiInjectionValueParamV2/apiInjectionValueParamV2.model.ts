import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiInjectionValueParamV2 {
  id?: number;
  injection_param_id: number;
  oauth_id: number;
  value: string;
  token?: string;
  date_added?: string | Moment;
}

export interface ISearchSpsApiInjectionValueParamV2 extends ISearch {
  is_lookup?: boolean;
}
