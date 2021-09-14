import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigFileType {
  id?: number;
  name: string;
  description: string;
  date_added?: string | Moment;
}

export interface ISearchConfigFileType extends ISearch {
  is_lookup?: boolean;
}
