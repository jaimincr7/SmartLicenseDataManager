import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsTriggerType {
  id?: number;
  name?: string;
  description?: string;
  date_added?: string | Moment;
}

export interface ISearchCmsTriggerType extends ISearch {
  is_lookup?: boolean;
}
