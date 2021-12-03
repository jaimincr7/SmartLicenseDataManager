import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICiscoSiteMatrix {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  installed_at_site_id?: string;
  historical_shipped_instance_count?: number;
  installed_at_site_status?: string;
  installed_at_customer_name?: string;
  installed_at_address_line?: string;
  installed_at_city?: string;
  installed_at_country?: string;
  installed_at_postal_code?: string;
  installed_at_state_province?: string;
  installed_at_cr_party_id?: string;
  installed_at_cr_party_name?: string;
  installed_at_gu_id?: string;
  installed_at_gu_name?: string;
  date_added?: string | Moment;
}

export interface ISearchCiscoSiteMatrix extends ISearch {
  is_lookup?: boolean;
}
