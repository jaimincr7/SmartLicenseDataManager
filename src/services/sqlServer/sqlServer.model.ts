import { ISearch } from '../../common/models/commont';

export interface ISqlServer {
  id?: number;
  company_id?: number;
  company_name?: string;
  bu_id?: number;
  bu_name?: string;
  date_added?: Date;
  sql_cluster?: string;
  host?: string;
  device_name?: string;
  device_type?: string;
  product_family?: string;
  version?: string;
  edition?: string;
  device_state?: string;
  software_state?: string;
  cluster?: string;
  source?: string;
  operating_system?: string;
  os_type?: string;
  tenant_id?: number;
  tenant_name?: string;
  raw_software_title?: string;
  product_name?: string;
  fqdn?: string;
  service?: string;
  cost_code?: string;
  line_of_business?: string;
  market?: string;
  application?: string;
  data_center?: string;
  serial_number?: string;
  sql_cluster_node_type?: string;
}

export interface ISearchSqlServer extends ISearch {
  is_lookup : boolean;
}
