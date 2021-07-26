import { ISearch } from '../../../common/models/common';

export interface IWindowsServerExclusions {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  field: string;
  condition: string;
  value: string;
  enabled?: boolean;
  instance_count?: number;
  tenant_id?: number;
  tenant_name?: string;
}

export interface ISearchWindowsServerExclusions extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  selected_date?: Date;
}
