import { ISearch } from '../../../common/models/common';

export interface IWindowsServerEntitlements {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  date_added?: Date;
  license_id?: number;
  qty_01?: number;
  qty_02?: number;
  qty_03?: number;
  tenant_id?: number;
  tenant_name?: string;
}

export interface ISearchWindowsServerEntitlements extends ISearch {
  is_lookup?: boolean;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
}
