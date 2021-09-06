import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbUser {
  id?: number;
  name: string;
  email: string;
  first_name: string;
  last_name?: string;
  is_service_account?: boolean;
  is_resource?: boolean;
  in_active_directory?: boolean;
  active_directory_guid?: string;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbUser extends ISearch {
  is_lookup?: boolean;
}
