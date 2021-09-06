import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbUserMap {
  id?: number;
  user_id: number;
  device_id: number;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbUserMap extends ISearch {
  is_lookup?: boolean;
}
