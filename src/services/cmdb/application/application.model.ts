import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbApplication {
  id?: number;
  name: string;
  publisher?: string;
  version?: string;
  edition?: string;
  license_model_id?: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbApplication extends ISearch {
  is_lookup?: boolean;
}
