import { ILookup } from '../../services/common/common.model';

export interface IGlobalSearch {
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
}

export interface ICommonState {
  search: IGlobalSearch;
  tenantLookup: {
    data: ILookup[];
    loading: boolean;
  };
  companyLookup: {
    data: ILookup[];
    loading: boolean;
  };
  buLookup: {
    data: ILookup[];
    loading: boolean;
  };
}
