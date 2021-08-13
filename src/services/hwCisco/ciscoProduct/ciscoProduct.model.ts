import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICiscoProduct {
  id?: number;
  tenant_id: number;
  company_id?: number;
  bu_id?: number;
  source?: string;
  uid: string;
  current_organization?: string;
  previous_organization?: string;
  responsible_party?: string;
  cisco_install_site_id?: string;
  cisco_ship_to_id?: string;
  product_id?: string;
  serial_number?: string;
  instance_id?: string;
  parent_sn?: string;
  parent_instance_id?: string;
  parent_child_relationship?: string;
  collected_sn?: string;
  host_id?: string;
  install_base_status?: string;
  replacement_sn?: string;
  zone_assignment?: string;
  zone_description?: string;
  software_license_pak?: string;
  product_relationship?: string;
  parent_child_indicator?: string;
  minor_follow_parent?: boolean;
  discovery_system_status?: string;
  notes?: string;
  corrective_action?: string;
  ship_date?: string | Moment;
  product_quantity?: number;
  date_data_added?: string | Moment;
  original_data_source?: string;
  last_update_data_source?: string;
  last_update_date?: string | Moment;
  smart_account?: string;
  warranty_type?: string;
  warranty_end_date?: string | Moment;
  hardware_bill_to?: string;
  po?: string;
  so?: string;
  date_added?: string | Moment;
}

export interface ISearchCiscoProduct extends ISearch {
  is_lookup?: boolean;
}
