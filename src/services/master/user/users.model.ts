import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IUser {
  id: number;
  username: string;
  display_name: string;
  email?: string;
  source: string;
  password_hash: string;
  password_salt: string;
  last_directory_update?: string | Moment;
  user_image?: string;
  insert_date: string | Moment;
  insert_user_id: number;
  update_date?: string | Moment;
  update_user_id?: number;
  is_active: number;
  tenant_id: number;
  company_id?: number;
  mobile_phone_number?: string;
  mobile_phone_verified: boolean;
  two_factor_auth?: number;
  //user_roles: UserRole[];
  date_added?: string | Moment;
}

export interface ISearchUser extends ISearch {
  is_lookup?: boolean;
}
