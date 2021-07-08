import { ISearch } from '../../../common/models/common';

export interface ISqlServerOverrides {
  id?: number;
  company_id?: number;
  bu_id?: number;
  device_name?: string;
  override_field?: string;
  override_value?: string;
  enabled?: boolean;
  version?: string;
  edition?: string;
  source?: string;
  notes?: string;
  tenant_id: number;
}

export interface ISearchSqlServerOverrides extends ISearch {
  is_lookup?: boolean;
}
