import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigSqlServerLicense {
  [x: string]: any;
  id?: number;
  product_name: string;
  service_id: number;
  edition_id: number;
  version_id: number;
  license_unit_id: number;
  units_per_license: number;
  license_quantity_minimum: number;
  server_cal_eligible?: boolean;
  alternate_license_type: boolean;
  includes_sa?: boolean;
  server_mobility_rights?: boolean;
  date_added?: string | Moment;
}

export interface ISearchConfigSqlServerLicense extends ISearch {
  is_lookup?: boolean;
}
