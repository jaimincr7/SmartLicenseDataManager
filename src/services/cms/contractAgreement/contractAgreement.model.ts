import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsContractAgreement {
  id?: number;
  tenant_id: number;
  company_id: number;
  bu_id?: number;
  start_date: string | Moment;
  end_date?: string | Moment;
  transaction_date: string | Moment;
  publisher_id: number;
  vendor_id?: number;
  contract_number?: string;
  contract_name: string;
  description?: string;
  trigger_type_id: number;
  contractual_owner_contact_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmsContractAgreement extends ISearch {
  is_lookup?: boolean;
}
