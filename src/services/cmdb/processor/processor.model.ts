import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbProcessor {
  id?: number;
  name: string;
  manufacturer?: string;
  model?: string;
  family?: string;
  number_of_processors?: number;
  number_of_logical_processors?: number;
  number_of_cores?: number;
  hyper_threading?: string;
  date_added?: string | Moment;
}

export interface ISearchCmdbProcessor extends ISearch {
  is_lookup?: boolean;
}
