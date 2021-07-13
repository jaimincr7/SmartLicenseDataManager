import { ILookup } from '../../services/common/common.model';

export interface IGlobalSearch {
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
}

export interface IGlobalSearchState {
  search: IGlobalSearch;
  globalTenantLookup: {
    data: ILookup[];
    loading: boolean;
  };
  globalCompanyLookup: {
    data: ILookup[];
    loading: boolean;
  };
  globalBULookup: {
    data: ILookup[];
    loading: boolean;
  };
}
