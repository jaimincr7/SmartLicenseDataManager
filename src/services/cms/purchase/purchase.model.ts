import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsPurchase {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  vendor_id: number;
  contract_agreement_id?: number;
  purchase_date: string | Moment;
  purchase_order_number: string;
  spend_type_id?: number;
  purchase_contact_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmsPurchase extends ISearch {
  is_lookup?: boolean;
}
