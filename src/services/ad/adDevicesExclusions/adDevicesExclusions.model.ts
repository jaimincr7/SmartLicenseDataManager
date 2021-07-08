import { ISearch } from '../../../common/models/common';

export interface IAdDevicesExclusions {
  id?: number;
  company_id?: number;
  bu_id?: number;
  field?: string;
  condition?: string;
  value?: string;
  desktop?: boolean;
  server?: boolean;
  unknown?: boolean;
  tenant_id?: number;
  instance_count?: number;
  decom?: boolean;
  company_name?: string;
  bu_name?: string;
  tenant_name?: string;
}

export interface ISearchAdDevicesExclusions extends ISearch {
  is_lookup?: boolean;
}
