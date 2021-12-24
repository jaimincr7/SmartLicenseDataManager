import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAdUser {
  id?: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  description?: string;
  display_name?: string;
  distinguished_name?: string;
  enabled?: boolean;
  given_name?: string;
  last_logon?: string;
  last_logon_date?: string | Moment;
  locked_out?: boolean;
  name?: string;
  object_class?: string;
  object_guid?: string;
  password_last_set?: string | Moment;
  password_never_expires?: boolean;
  password_not_required?: boolean;
  sam_account_name?: string;
  sid?: string;
  surname?: string;
  user_principal_name?: string;
  whenChanged?: string | Moment;
  when_created?: string | Moment;
  date_added?: string | Moment;
  exclusion?: string;
  tenant_id?: number;
  exclusion_id?: number;
  last_logon_timestamp?: string;
  active?: boolean;
  qualified?: boolean;
  o365_licensed?: boolean;
  o365_licenses?: string;
  domain?: string;
  exchangeActiveMailbox?: boolean;
}

export interface ISearchAdUsers extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  user_id?: number;
}
