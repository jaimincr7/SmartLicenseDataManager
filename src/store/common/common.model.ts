import { ILookup } from '../../services/common/common.model';

export interface ICommonState {
  tenantLookup: {
    data: ILookup[],
    loading: boolean
  };
  companyLookup: {
    data: ILookup[],
    loading: boolean
  };
  buLookup: {
    data: ILookup[],
    loading: boolean
  };
}
