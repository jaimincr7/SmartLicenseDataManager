import { ILookup } from '../../services/common/common.model';

export interface ICommonState {
  tenantLookup: {
    data: ILookup[];
    loading: boolean;
  };
  companyLookup: {
    data: ILookup[];
    loading: boolean;
  };
  allCompanyLookup: {
    data: ILookup[];
    loading: boolean;
  };
  buLookup: {
    data: ILookup[];
    loading: boolean;
  };
  sqlServerLicenseLookup: {
    data: ILookup[];
    loading: boolean;
  };
  agreementTypesLookup: {
    data: ILookup[];
    loading: boolean;
  };
  currencyLookup: {
    data: ILookup[];
    loading: boolean;
  };
  windowsServerLicenseLookup: {
    data: ILookup[];
    loading: boolean;
  };
  o365ProductsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  deleteDataset: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  saveTableColumnSelection: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
