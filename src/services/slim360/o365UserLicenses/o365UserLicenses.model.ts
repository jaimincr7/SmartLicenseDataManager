import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISlim360O365UserLicenses {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  azure_tenant_id: string;
  user_principal_name: string;
  assigned_licenses?: string;
  date_added?: string | Moment;
}

export interface ISearchSlim360O365UserLicenses extends ISearch {
  is_lookup?: boolean;
}
