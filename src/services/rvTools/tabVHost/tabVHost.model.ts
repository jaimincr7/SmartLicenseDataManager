import { ISearch } from '../../../common/models/common';

export interface ITabVHost {
  id?: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  host?: string;
  data_center?: string;
  cluster?: string;
  cpu?: number;
  cores_per_cpu?: number;
  cores?: number;
  domain?: string;
  cpu_model?: string;
  esx_version?: string;
  tenant_id?: number;
}

export interface ISearchTabVHost extends ISearch {
  is_lookup?: boolean;
}
