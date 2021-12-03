import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAzureRateCard {
  id?: number;
  effective_date?: string | Moment;
  date_added?: string | Moment;
  included_quantity?: number;
  meter_category?: string;
  meter_id?: string;
  meter_name?: string;
  meter_rates?: string;
  meter_region?: string;
  meter_status?: string;
  meter_sub_category?: string;
  meter_tags?: string;
  unit?: string;
}

export interface ISearchAzureRateCard extends ISearch {
  is_lookup?: boolean;
}
