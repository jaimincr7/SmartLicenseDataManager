import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAzureAPIVmSizes {
  id?: number;
  date_added?: string | Moment;
  name?: string;
  number_of_cores?: number;
  os_disk_size_in_gb?: number;
  resource_disk_size_in_gb?: number;
  memory_in_gb?: number;
  max_data_disk_count?: number;
}

export interface ISearchAzureAPIVmSizes extends ISearch {
  is_lookup?: boolean;
}
