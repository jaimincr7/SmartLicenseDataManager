import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISpsApiGroup {
  id?: number;
  name: string;
  stored_procedure_post_process?: string;
  date_added?: string | Moment;
}

export interface ISearchSpsApiGroup extends ISearch {
  is_lookup?: boolean;
}
