import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IConfigLicenseUnits {
  [x: string]: any;
  id?: number;
  license_unit: string;
  date_added?: string | Moment;
}

export interface ISearchConfigLicenseUnits extends ISearch {
  is_lookup?: boolean;
}
