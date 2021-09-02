import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbSoftware {
  id?: number;
  name: string;
  version?: string;
  edition?: string;
  installed_date?: string | Moment;
  uninstall_string?: string;
  file_name?: string;
  file_path?: string;
  package_guid?: string;
  last_scanned?: string;
  device_id: number;
  application_id: number;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbSoftware extends ISearch {
  is_lookup?: boolean;
}
