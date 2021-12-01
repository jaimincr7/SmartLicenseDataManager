import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ISqlServerEntitlements {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  date_added?: string | Moment;
  license_id?: number;
  qty_01?: number;
  qty_02?: number;
  qty_03?: number;
  tenant_id?: number;
  tenant_name?: string;
}

export interface ISearchSqlServerEntitlements extends ISearch {
  is_lookup?: boolean;
}
