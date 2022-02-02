import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiInjectionValueParamV2 {
  [x: string]: any;
  id?: number;
  oauth_id: number;
  injection_values: [
    {
      injection_param_id: number;
      value: string;
    }
  ];
  date_added?: string | Moment;
}

export interface ISearchSpsApiInjectionValueParamV2 extends ISearch {
  is_lookup?: boolean;
}
