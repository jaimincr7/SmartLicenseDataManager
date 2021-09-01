import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmdbExclusion {
  id?: number;
  name: string;
  exclusion_id_component_id?: number;
  exclusion_id_location_id?: number;
  exclusion_id_operation_id?: number;
  is_enabled?: boolean;
  value?: string;
  order?: string;
  exclusion_type_id?: number;
  bu_id: number;
  company_id: number;
  tenant_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmdbExclusion extends ISearch {
  is_lookup?: boolean;
}
