import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsPurchaseLineItem {
  id?: number;
  purchase_id: number;
  part_number: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  extended_price: number;
  currency_id: number;
  category_id: number;
  category_extended_id: number;
  start_date?: string | Moment;
  end_date?: string | Moment;
  date_added?: string | Moment;
}

export interface ISearchCmsPurchaseLineItem extends ISearch {
  is_lookup?: boolean;
}
