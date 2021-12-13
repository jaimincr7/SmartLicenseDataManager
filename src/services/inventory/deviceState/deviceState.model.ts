import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IDeviceState {
  id?: number;
  company_id: number;
  bu_id: number;
  pattern?: string;
  state_name: string;
  tenant_id: number;
  start_position?: number;
  exact_match?: boolean;
  entire_field?: boolean;
  date_added?: string | Moment;
}

export interface ISearchDeviceState extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  selected_date_ws: Date;
  include_sc: boolean;
  selected_date_ss: Date;
  selected_date_device: Date;
}
