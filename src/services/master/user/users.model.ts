import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IUser {
  [x: string]: any;
  id: number;
  username: string;
  display_name: string;
  email?: string;
  source: string;
  password_hash: string;
  password_salt: string;
  user_image?: string;
  insert_date: string | Moment;
  insert_user_id: number;
  update_date?: string | Moment;
  update_user_id?: number;
  is_active: number;
  tenant_id: number;
  company_id?: number;
  mobile_phone_number?: string;
  two_factor_auth?: number;
  role_ids?: string[] | number[];
  date_added?: string | Moment;
}

export interface ISearchUser extends ISearch {
  is_lookup?: boolean;
}
