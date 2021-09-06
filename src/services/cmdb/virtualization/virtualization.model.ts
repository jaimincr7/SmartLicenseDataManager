import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbVirtualization {
  id?: number;
  cluster_name: string;
  cluster_id: string;
  data_center_name?: string;
  data_center_id?: number;
  is_drs_enabled?: boolean;
  is_ha_enabled?: boolean;
  hypervisor_type?: string;
  host_name?: string;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbVirtualization extends ISearch {
  is_lookup?: boolean;
}
