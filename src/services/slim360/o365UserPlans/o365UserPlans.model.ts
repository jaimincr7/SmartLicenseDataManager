import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISlim360O365UserPlans {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  azure_tenant_id: string;
  user_principal_name: string;
  assigned_plans?: string;
  date_added?: string | Moment;
}

export interface ISearchSlim360O365UserPlans extends ISearch {
  is_lookup?: boolean;
}
