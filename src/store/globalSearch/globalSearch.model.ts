import { ILookup } from '../../services/common/common.model';
import { Moment } from 'moment';

export interface IGlobalSearch {
  tenant_id?: number;
  company_id?: number;
  bu_id?: number;
  date_added?: Moment | string;
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
