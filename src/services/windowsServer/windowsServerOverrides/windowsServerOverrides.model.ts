import { ISearch } from '../../../common/models/common';

export interface IWindowsServerOverrides {
  id?: number;
  company_id?: number;
  bu_id?: number;
  tenant_id?: number;
  device_name?: string;
  id_field?: string;
  id_value?: string;
  id_device_type?: string;
  override_field?: string;
  override_value?: string;
  enabled?: boolean;
  version?: string;
  edition?: string;
  source?: string;
  notes?: string;
}

export interface ISearchWindowsServerOverrides extends ISearch {
  is_lookup?: boolean;
}
