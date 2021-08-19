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
  cmsPurchaseLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsCategoryLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsCategoryExtendedLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsContractAgreementLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsContractLookup: {
    data: ILookup[];
    loading: boolean;
  };
  UserLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsContactLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsVectorLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsTriggerTypeLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsPublisherLookup: {
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
