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
  cronJobStatus: {
    data: ILookup[];
    loading: boolean;
  };
  ApiTypeV2: {
    data: ILookup[];
    loading: boolean;
  };
  OauthIdV2: {
    data: any;
    loading: boolean;
  };
  manageCronJob: {
    messages: string[];
    hasErrors: boolean;
    loading: boolean;
  };
  bulkDelete: {
    messages: string[];
    hasErrors: boolean;
    loading: boolean;
  };
  setModelPopUpSelection: {
    messages: string[];
    hasErrors: boolean;
    loading: boolean;
  };
  getModelPopUpSelection: {
    id: any;
    data: any;
    hasErrors: boolean;
    loading: boolean;
  };
  cronFormula: {
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
  getScheduledDate: {
    data: ILookup[];
    loading: boolean;
  };
  getScheduledDateforWindows: {
    data: ILookup[];
    loading: boolean;
  };
  getScheduledDateforSql: {
    data: ILookup[];
    loading: boolean;
  };
  sqlServerLicenseLookup: {
    data: ILookup[];
    loading: boolean;
  };
  softwareNormalizationLookup: {
    data: ILookup[];
    loading: boolean;
  };
  processRunning: {
    data: any[];
    loading: boolean;
  };
  osNormalizationLookup: {
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
  cmdbDeviceLookup: {
    data: ILookup[];
    loading: boolean;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  cmdbUserLookup: {
    data: ILookup[];
    loading: boolean;
  };
  o365ProductsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiGroupLookup: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiOAuthLookup: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiUrlInjectionLookup: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiUrlInjectionV2Lookup: {
    data: ILookup[];
    loading: boolean;
  };
  tablesForDelete: {
    data: any[];
    loading: boolean;
  };
  spsApiTypeLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configSqlServerEditionsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configSqlServerVersionsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configSqlServerServicesLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configWindowsServerEditionsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configWindowsServerVersionsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configWindowsServerServicesLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configLicenseUnitsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configSupportTypesLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configOnlineProductsLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configOnlineServicePlansLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbLicenseModelLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbOperatingSystemLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbProcessorLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbVirtualizationLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbApplicationLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbExclusionComponentLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbExclusionOperationLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbExclusionLocationLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmdbExclusionTypeLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configComponentLookup: {
    data: ILookup[];
    loading: boolean;
  };
  configComponentTableColumnLookup: {
    data: ILookup[];
    loading: boolean;
  };
  cmsExpenditureTypeLookup: {
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
  spsApiGroups: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiBaseUrl: {
    data: ILookup[];
    loading: boolean;
  };
  spsApiTypes: {
    data: ILookup[];
    loading: boolean;
  };
}
