import { ISearch } from '../../common/models/common';

export interface ISqlServerPricing {
  id?: number;
  company_id?: number;
  bu_id?: number;
  license_id?: number;
  price?: number;
  currency_id?: number;
  agreement_type_id?: number;
  tenant_id: number;
}

export interface ISearchSqlServerPricing extends ISearch {
  is_lookup?: boolean;
}
