import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigWindowsServerLicense {
  [x: string]: any;
  id?: number;
  product_name: string;
  edition_id: number;
  version_id: number;
  license_unit_id: number;
  units_per_license: number;
  additional_virtual_oes_s: number;
  license_quantity_minimum: number;
  alternate_license_type: boolean;
  includes_sa?: boolean;
  includes_windows_server?: boolean;
  includes_system_center?: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigWindowsServerLicense extends ISearch {
  is_lookup?: boolean;
}
