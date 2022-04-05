import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../common/models/common';
import { ILookup } from '../../services/common/common.model';
import { RootState } from '../app.model';
import {
  getBULookup,
  getCompanyLookup,
  getSqlServerLicenseLookup,
  getTenantLookup,
  getAgreementTypesLookup,
  getCurrencyLookup,
  deleteDataset,
  getWindowsServerLicenseLookup,
  saveTableColumnSelection,
  getAllCompanyLookup,
  getO365ProductsLookup,
  getCmsCategoryLookup,
  getCmsPurchaseLookup,
  getCmsCategoryExtendedLookup,
  getCmsContractAgreementLookup,
  getCmsContractLookup,
  getCmsContactLookup,
  getUserLookup,
  getCmsVectorLookup,
  getCmsPublisherLookup,
  getCmsTriggerTypeLookup,
  getCmsExpenditureTypeLookup,
  getCmdbLicenseModelLookup,
  getCmdbOperatingSystemLookup,
  getCmdbProcessorLookup,
  getCmdbVirtualizationLookup,
  getCmdbApplicationLookup,
  getCmdbUserLookup,
  getCmdbDeviceLookup,
  getCmdbExclusionComponentLookup,
  getCmdbExclusionOperationLookup,
  getCmdbExclusionLocationLookup,
  getCmdbExclusionTypeLookup,
  getConfigComponentLookup,
  getConfigComponentTableColumnLookup,
  getSpsApiGroups,
  getSpsApiTypes,
  getConfigOnlineProductsLookup,
  getConfigOnlineServicePlansLookup,
  getConfigSupportTypesLookup,
  getConfigSqlServerEditionsLookup,
  getConfigSqlServerServicesLookup,
  getConfigSqlServerVersionsLookup,
  getConfigLicenseUnitsLookup,
  getConfigWindowsServerVersionsLookup,
  getConfigWindowsServerEditionsLookup,
  getConfigWindowsServerServicesLookup,
  getSpsApiTypeLookup,
  getSpsApiGroupLookup,
  updateMultiple,
  getScheduleDate,
  configModelPopUpDataSelection,
  getConfigModelPopUpDataSelection,
  getSpsApiBaseUrl,
  getSpsApiOAuthLookup,
  getSpsApiUrlInjectionLookup,
  getScheduleDateforWindowsServer,
  getScheduleDateforSqlServer,
  getSpsApiUrlInjectionV2Lookup,
  getTablesForDelete,
  getApiTypeV2Lookup,
  getOAuthV2IdLookup,
  getSoftwareNormalizationLookup,
  getOSNormalizationLookup,
  bulkDelete,
  getProccessRunning,
} from './common.action';
import { ICommonState } from './common.model';

export const initialState: ICommonState = {
  tenantLookup: {
    data: [],
    loading: false,
  },
  companyLookup: {
    data: [],
    loading: false,
  },
  cronFormula: {
    data: [],
    loading: false,
  },
  ApiTypeV2: {
    data: [],
    loading: false,
  },
  OauthIdV2: {
    data: null,
    loading: false,
  },
  manageCronJob: {
    messages: [],
    hasErrors: false,
    loading: false,
  },
  setModelPopUpSelection: {
    messages: [],
    hasErrors: false,
    loading: false,
  },
  getModelPopUpSelection: {
    id: null,
    data: {},
    hasErrors: false,
    loading: false,
  },
  allCompanyLookup: {
    data: [],
    loading: false,
  },
  buLookup: {
    data: [],
    loading: false,
  },
  tablesForDelete: {
    data: [],
    loading: false,
  },
  cronJobStatus: {
    data: [],
    loading: false,
  },
  getScheduledDate: {
    data: [],
    loading: false,
  },
  getScheduledDateforWindows: {
    data: [],
    loading: false,
  },
  getScheduledDateforSql: {
    data: [],
    loading: false,
  },
  save: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  sqlServerLicenseLookup: {
    data: [],
    loading: false,
  },
  softwareNormalizationLookup: {
    data: [],
    loading: false,
  },
  processRunning: {
    data: [],
    loading: false,
  },
  osNormalizationLookup: {
    data: [],
    loading: false,
  },
  agreementTypesLookup: {
    data: [],
    loading: false,
  },
  currencyLookup: {
    data: [],
    loading: false,
  },
  windowsServerLicenseLookup: {
    data: [],
    loading: false,
  },
  cmdbDeviceLookup: {
    data: [],
    loading: false,
  },
  cmdbUserLookup: {
    data: [],
    loading: false,
  },
  o365ProductsLookup: {
    data: [],
    loading: false,
  },
  spsApiGroupLookup: {
    data: [],
    loading: false,
  },
  spsApiOAuthLookup: {
    data: [],
    loading: false,
  },
  spsApiUrlInjectionLookup: {
    data: [],
    loading: false,
  },
  spsApiUrlInjectionV2Lookup: {
    data: [],
    loading: false,
  },
  spsApiTypeLookup: {
    data: [],
    loading: false,
  },
  configSqlServerEditionsLookup: {
    data: [],
    loading: false,
  },
  configSqlServerVersionsLookup: {
    data: [],
    loading: false,
  },
  configSqlServerServicesLookup: {
    data: [],
    loading: false,
  },
  configWindowsServerEditionsLookup: {
    data: [],
    loading: false,
  },
  configWindowsServerVersionsLookup: {
    data: [],
    loading: false,
  },
  configWindowsServerServicesLookup: {
    data: [],
    loading: false,
  },
  configLicenseUnitsLookup: {
    data: [],
    loading: false,
  },
  configSupportTypesLookup: {
    data: [],
    loading: false,
  },
  configOnlineProductsLookup: {
    data: [],
    loading: false,
  },
  configOnlineServicePlansLookup: {
    data: [],
    loading: false,
  },
  cmdbLicenseModelLookup: {
    data: [],
    loading: false,
  },
  cmdbOperatingSystemLookup: {
    data: [],
    loading: false,
  },
  cmdbProcessorLookup: {
    data: [],
    loading: false,
  },
  cmdbVirtualizationLookup: {
    data: [],
    loading: false,
  },
  cmdbApplicationLookup: {
    data: [],
    loading: false,
  },
  cmdbExclusionComponentLookup: {
    data: [],
    loading: false,
  },
  cmdbExclusionOperationLookup: {
    data: [],
    loading: false,
  },
  cmdbExclusionLocationLookup: {
    data: [],
    loading: false,
  },
  cmdbExclusionTypeLookup: {
    data: [],
    loading: false,
  },
  configComponentLookup: {
    data: [],
    loading: false,
  },
  configComponentTableColumnLookup: {
    data: [],
    loading: false,
  },
  cmsExpenditureTypeLookup: {
    data: [],
    loading: false,
  },
  cmsPurchaseLookup: {
    data: [],
    loading: false,
  },
  cmsCategoryLookup: {
    data: [],
    loading: false,
  },
  cmsCategoryExtendedLookup: {
    data: [],
    loading: false,
  },
  cmsContractAgreementLookup: {
    data: [],
    loading: false,
  },
  cmsContactLookup: {
    data: [],
    loading: false,
  },
  cmsVectorLookup: {
    data: [],
    loading: false,
  },
  cmsTriggerTypeLookup: {
    data: [],
    loading: false,
  },
  cmsPublisherLookup: {
    data: [],
    loading: false,
  },
  cmsContractLookup: {
    data: [],
    loading: false,
  },
  UserLookup: {
    data: [],
    loading: false,
  },
  deleteDataset: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  bulkDelete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  saveTableColumnSelection: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  spsApiGroups: {
    data: [],
    loading: false,
  },
  spsApiBaseUrl: {
    data: [],
    loading: false,
  },
  spsApiTypes: {
    data: [],
    loading: false,
  },
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    // setGlobalSearch: (state, action: PayloadAction<IGlobalSearch>) => {
    //   state.search = action.payload;
    // },
    clearDeleteDatasetMessages: (state) => {
      state.deleteDataset.messages = [];
    },
    clearCompanyLookUp: (state) => {
      state.companyLookup.data = [];
    },
    clearBULookUp: (state) => {
      state.buLookup.data = [];
    },
    clearDateLookup: (state) => {
      state.getScheduledDate.data = [];
      state.getScheduledDateforSql.data = [];
      state.getScheduledDateforWindows.data = [];
    },
    clearCommon: () => {
      return initialState;
    },
    clearSaveTableColumnSelection: (state) => {
      state.saveTableColumnSelection.messages = [];
    },
    clearCronJobSchedularMessages: (state) => {
      state.manageCronJob.messages = [];
    },
    clearSpsApiTypesLookup: (state) => {
      state.spsApiTypes.data = [];
    },
    clearBulkDeleteMessage: (state) => {
      state.bulkDelete.messages = [];
    },
    clearSpsApiGroupsLookup: (state) => {
      state.spsApiGroups.data = [];
    },
    clearSpsApiOAuthLookup: (state) => {
      state.spsApiGroups.data = [];
    },
    clearSpsApiUrlInjectionLookup: (state) => {
      state.spsApiGroups.data = [];
    },
    clearSpsApiBaseUrlLookup: (state) => {
      state.spsApiBaseUrl.data = [];
    },
    clearMultipleUpdateMessages: (state) => {
      state.save.messages = [];
    },
    clearConfigModelPopUpDataSelection: (state) => {
      state.setModelPopUpSelection.messages = [];
    },
    cleargetModelPopUpDataSelection: (state) => {
      state.getModelPopUpSelection.data = {};
      state.getModelPopUpSelection.id = null;
      state.getModelPopUpSelection.hasErrors = false;
      state.getModelPopUpSelection.loading = false;
    },
  },
  extraReducers: {
    // Tenant lookup
    [getTenantLookup.pending.type]: (state) => {
      state.tenantLookup.loading = true;
    },
    [getTenantLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.tenantLookup.data = action.payload;
      state.tenantLookup.loading = false;
    },

    // Model Pop Up Selection
    [configModelPopUpDataSelection.pending.type]: (state) => {
      state.setModelPopUpSelection.loading = true;
      state.setModelPopUpSelection.messages = [];
    },
    [configModelPopUpDataSelection.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.setModelPopUpSelection.loading = false;
      state.setModelPopUpSelection.hasErrors = false;
      state.setModelPopUpSelection.messages = action.payload.messages;
    },
    [configModelPopUpDataSelection.rejected.type]: (state) => {
      state.setModelPopUpSelection.loading = false;
      state.setModelPopUpSelection.hasErrors = true;
    },

    // Model Pop Up Selection
    [getConfigModelPopUpDataSelection.pending.type]: (state) => {
      state.getModelPopUpSelection.loading = true;
      state.getModelPopUpSelection.data = {};
      state.getModelPopUpSelection.id = null;
    },
    [getConfigModelPopUpDataSelection.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.getModelPopUpSelection.loading = false;
      state.getModelPopUpSelection.hasErrors = false;
      if (action.payload) {
        const { id, selection } = action.payload;
        state.getModelPopUpSelection.id = id;
        state.getModelPopUpSelection.data = JSON.parse(selection);
      }
    },
    [getConfigModelPopUpDataSelection.rejected.type]: (state) => {
      state.getModelPopUpSelection.loading = false;
      state.getModelPopUpSelection.hasErrors = true;
    },

    // Company lookup
    [getCompanyLookup.pending.type]: (state) => {
      state.companyLookup.loading = true;
    },
    [getCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.companyLookup.data = action.payload;
      state.companyLookup.loading = false;
    },

    // Api Type V2
    [getApiTypeV2Lookup.pending.type]: (state) => {
      state.ApiTypeV2.loading = true;
    },
    [getApiTypeV2Lookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.ApiTypeV2.data = action.payload;
      state.ApiTypeV2.loading = false;
    },

    // OAuth Id V2
    [getOAuthV2IdLookup.pending.type]: (state) => {
      state.OauthIdV2.loading = true;
    },
    [getOAuthV2IdLookup.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { id } = action.payload;
      state.OauthIdV2.data = id;
      state.OauthIdV2.loading = false;
    },

    // All Company lookup
    [getAllCompanyLookup.pending.type]: (state) => {
      state.allCompanyLookup.loading = true;
    },
    [getAllCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.allCompanyLookup.data = action.payload;
      state.allCompanyLookup.loading = false;
    },

    // BU lookup
    [getBULookup.pending.type]: (state) => {
      state.buLookup.loading = true;
    },
    [getBULookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.buLookup.data = action.payload;
      state.buLookup.loading = false;
    },

    // Scheduled Date Multiple
    [getScheduleDate.pending.type]: (state) => {
      state.getScheduledDate.loading = true;
    },
    [getScheduleDate.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.getScheduledDate.data = action.payload;
      state.getScheduledDate.loading = false;
    },

    // Scheduled Date Multiple
    [getScheduleDateforWindowsServer.pending.type]: (state) => {
      state.getScheduledDateforWindows.loading = true;
    },
    [getScheduleDateforWindowsServer.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.getScheduledDateforWindows.data = action.payload;
      state.getScheduledDateforWindows.loading = false;
    },

    // Scheduled Date Multiple
    [getScheduleDateforSqlServer.pending.type]: (state) => {
      state.getScheduledDateforSql.loading = true;
    },
    [getScheduleDateforSqlServer.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.getScheduledDateforSql.data = action.payload;
      state.getScheduledDateforSql.loading = false;
    },

    // Update Multiple
    [updateMultiple.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [updateMultiple.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [updateMultiple.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Sql Server License lookup
    [getSqlServerLicenseLookup.pending.type]: (state) => {
      state.sqlServerLicenseLookup.loading = true;
    },
    [getSqlServerLicenseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.sqlServerLicenseLookup.data = action.payload;
      state.sqlServerLicenseLookup.loading = false;
    },

    // Software Normal. lookup
    [getSoftwareNormalizationLookup.pending.type]: (state) => {
      state.softwareNormalizationLookup.loading = true;
    },
    [getSoftwareNormalizationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.softwareNormalizationLookup.data = action.payload;
      state.softwareNormalizationLookup.loading = false;
    },

    // Back Ground Proccesses
    [getProccessRunning.pending.type]: (state) => {
      state.processRunning.loading = true;
    },
    [getProccessRunning.fulfilled.type]: (state, action: PayloadAction<any[]>) => {
      state.processRunning.data = action.payload;
      state.processRunning.loading = false;
    },

    // OS Normal. lookup
    [getOSNormalizationLookup.pending.type]: (state) => {
      state.osNormalizationLookup.loading = true;
    },
    [getOSNormalizationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.osNormalizationLookup.data = action.payload;
      state.osNormalizationLookup.loading = false;
    },

    // Agreement Types lookup
    [getAgreementTypesLookup.pending.type]: (state) => {
      state.agreementTypesLookup.loading = true;
    },
    [getAgreementTypesLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.agreementTypesLookup.data = action.payload;
      state.agreementTypesLookup.loading = false;
    },

    // Currency lookup
    [getCurrencyLookup.pending.type]: (state) => {
      state.currencyLookup.loading = true;
    },
    [getCurrencyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.currencyLookup.data = action.payload;
      state.currencyLookup.loading = false;
    },

    // Windows Server License lookup
    [getWindowsServerLicenseLookup.pending.type]: (state) => {
      state.windowsServerLicenseLookup.loading = true;
    },
    [getWindowsServerLicenseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.windowsServerLicenseLookup.data = action.payload;
      state.windowsServerLicenseLookup.loading = false;
    },

    // CMDB Device lookup
    [getCmdbDeviceLookup.pending.type]: (state) => {
      state.cmdbDeviceLookup.loading = true;
    },
    [getCmdbDeviceLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbDeviceLookup.data = action.payload;
      state.cmdbDeviceLookup.loading = false;
    },

    // CMDB User lookup
    [getCmdbUserLookup.pending.type]: (state) => {
      state.cmdbUserLookup.loading = true;
    },
    [getCmdbUserLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbUserLookup.data = action.payload;
      state.cmdbUserLookup.loading = false;
    },

    // O365 Products lookup
    [getO365ProductsLookup.pending.type]: (state) => {
      state.o365ProductsLookup.loading = true;
    },
    [getO365ProductsLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.o365ProductsLookup.data = action.payload;
      state.o365ProductsLookup.loading = false;
    },

    // SpsApiGroup lookup
    [getSpsApiGroupLookup.pending.type]: (state) => {
      state.spsApiGroups.loading = true;
    },
    [getSpsApiGroupLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiGroups.data = action.payload;
      state.spsApiGroups.loading = false;
    },

    // SpsApiOAuth lookup
    [getSpsApiOAuthLookup.pending.type]: (state) => {
      state.spsApiOAuthLookup.loading = true;
    },
    [getSpsApiOAuthLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiOAuthLookup.data = action.payload;
      state.spsApiOAuthLookup.loading = false;
    },

    // SpsApi Url Injection lookup
    [getSpsApiUrlInjectionLookup.pending.type]: (state) => {
      state.spsApiUrlInjectionLookup.loading = true;
    },
    [getSpsApiUrlInjectionLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiUrlInjectionLookup.data = action.payload;
      state.spsApiUrlInjectionLookup.loading = false;
    },

    // SpsApi Url InjectionV2 lookup
    [getSpsApiUrlInjectionV2Lookup.pending.type]: (state) => {
      state.spsApiUrlInjectionV2Lookup.loading = true;
    },
    [getSpsApiUrlInjectionV2Lookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiUrlInjectionV2Lookup.data = action.payload;
      state.spsApiUrlInjectionV2Lookup.loading = false;
    },

    // Tables For Delete lookup
    [getTablesForDelete.pending.type]: (state) => {
      state.tablesForDelete.loading = true;
    },
    [getTablesForDelete.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.tablesForDelete.data = action.payload;
      state.tablesForDelete.loading = false;
    },

    // SpsApiBaseUrl lookup
    [getSpsApiBaseUrl.pending.type]: (state) => {
      state.spsApiBaseUrl.loading = true;
    },
    [getSpsApiBaseUrl.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiBaseUrl.data = action.payload;
      state.spsApiBaseUrl.loading = false;
    },

    // SpsApiType lookup
    [getSpsApiTypeLookup.pending.type]: (state) => {
      state.spsApiTypes.loading = true;
    },
    [getSpsApiTypeLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiTypes.data = action.payload;
      state.spsApiTypes.loading = false;
    },

    // Config Sql Server Editions lookup
    [getConfigSqlServerEditionsLookup.pending.type]: (state) => {
      state.configSqlServerEditionsLookup.loading = true;
    },
    [getConfigSqlServerEditionsLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configSqlServerEditionsLookup.data = action.payload;
      state.configSqlServerEditionsLookup.loading = false;
    },

    // Config Sql Server Services lookup
    [getConfigSqlServerServicesLookup.pending.type]: (state) => {
      state.configSqlServerServicesLookup.loading = true;
    },
    [getConfigSqlServerServicesLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configSqlServerServicesLookup.data = action.payload;
      state.configSqlServerServicesLookup.loading = false;
    },

    // Config Sql Server Versions lookup
    [getConfigSqlServerVersionsLookup.pending.type]: (state) => {
      state.configSqlServerVersionsLookup.loading = true;
    },
    [getConfigSqlServerVersionsLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configSqlServerVersionsLookup.data = action.payload;
      state.configSqlServerVersionsLookup.loading = false;
    },

    // Config Windows Server Versions lookup
    [getConfigWindowsServerVersionsLookup.pending.type]: (state) => {
      state.configWindowsServerVersionsLookup.loading = true;
    },
    [getConfigWindowsServerVersionsLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configWindowsServerVersionsLookup.data = action.payload;
      state.configWindowsServerVersionsLookup.loading = false;
    },

    // Config Windows Server Editions lookup
    [getConfigWindowsServerEditionsLookup.pending.type]: (state) => {
      state.configWindowsServerEditionsLookup.loading = true;
    },
    [getConfigWindowsServerEditionsLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configWindowsServerEditionsLookup.data = action.payload;
      state.configWindowsServerEditionsLookup.loading = false;
    },

    // Config Windows Server Services lookup
    [getConfigWindowsServerServicesLookup.pending.type]: (state) => {
      state.configWindowsServerServicesLookup.loading = true;
    },
    [getConfigWindowsServerServicesLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configWindowsServerServicesLookup.data = action.payload;
      state.configWindowsServerServicesLookup.loading = false;
    },

    // Config License Units lookup
    [getConfigLicenseUnitsLookup.pending.type]: (state) => {
      state.configLicenseUnitsLookup.loading = true;
    },
    [getConfigLicenseUnitsLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.configLicenseUnitsLookup.data = action.payload;
      state.configLicenseUnitsLookup.loading = false;
    },

    // Config Support Types lookup
    [getConfigSupportTypesLookup.pending.type]: (state) => {
      state.configSupportTypesLookup.loading = true;
    },
    [getConfigSupportTypesLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.configSupportTypesLookup.data = action.payload;
      state.configSupportTypesLookup.loading = false;
    },

    // Config Online Products lookup
    [getConfigOnlineProductsLookup.pending.type]: (state) => {
      state.configOnlineProductsLookup.loading = true;
    },
    [getConfigOnlineProductsLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.configOnlineProductsLookup.data = action.payload;
      state.configOnlineProductsLookup.loading = false;
    },

    // Config Online Service Plans lookup
    [getConfigOnlineServicePlansLookup.pending.type]: (state) => {
      state.configOnlineServicePlansLookup.loading = true;
    },
    [getConfigOnlineServicePlansLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configOnlineServicePlansLookup.data = action.payload;
      state.configOnlineServicePlansLookup.loading = false;
    },

    // CMDB License Model lookup
    [getCmdbLicenseModelLookup.pending.type]: (state) => {
      state.cmdbLicenseModelLookup.loading = true;
    },
    [getCmdbLicenseModelLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbLicenseModelLookup.data = action.payload;
      state.cmdbLicenseModelLookup.loading = false;
    },

    // Cmdb OS lookup
    [getCmdbOperatingSystemLookup.pending.type]: (state) => {
      state.cmdbOperatingSystemLookup.loading = true;
    },
    [getCmdbOperatingSystemLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbOperatingSystemLookup.data = action.payload;
      state.cmdbOperatingSystemLookup.loading = false;
    },

    // Cmdb Processor lookup
    [getCmdbProcessorLookup.pending.type]: (state) => {
      state.cmdbProcessorLookup.loading = true;
    },
    [getCmdbProcessorLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbProcessorLookup.data = action.payload;
      state.cmdbProcessorLookup.loading = false;
    },

    // Cmdb Virtualization lookup
    [getCmdbVirtualizationLookup.pending.type]: (state) => {
      state.cmdbVirtualizationLookup.loading = true;
    },
    [getCmdbVirtualizationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbVirtualizationLookup.data = action.payload;
      state.cmdbVirtualizationLookup.loading = false;
    },

    // Cmdb Application lookup
    [getCmdbApplicationLookup.pending.type]: (state) => {
      state.cmdbApplicationLookup.loading = true;
    },
    [getCmdbApplicationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbApplicationLookup.data = action.payload;
      state.cmdbApplicationLookup.loading = false;
    },

    // Cmdb Device lookup
    [getCmdbDeviceLookup.pending.type]: (state) => {
      state.cmdbDeviceLookup.loading = true;
    },
    [getCmdbDeviceLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbDeviceLookup.data = action.payload;
      state.cmdbDeviceLookup.loading = false;
    },

    // Cmdb Exclusion Components lookup
    [getCmdbExclusionComponentLookup.pending.type]: (state) => {
      state.cmdbExclusionComponentLookup.loading = true;
    },
    [getCmdbExclusionComponentLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbExclusionComponentLookup.data = action.payload;
      state.cmdbExclusionComponentLookup.loading = false;
    },

    // Cmdb Exclusion Operations lookup
    [getCmdbExclusionOperationLookup.pending.type]: (state) => {
      state.cmdbExclusionOperationLookup.loading = true;
    },
    [getCmdbExclusionOperationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbExclusionOperationLookup.data = action.payload;
      state.cmdbExclusionOperationLookup.loading = false;
    },

    // Cmdb Exclusion Locations lookup
    [getCmdbExclusionLocationLookup.pending.type]: (state) => {
      state.cmdbExclusionLocationLookup.loading = true;
    },
    [getCmdbExclusionLocationLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbExclusionLocationLookup.data = action.payload;
      state.cmdbExclusionLocationLookup.loading = false;
    },

    // Cmdb Exclusion Types lookup
    [getCmdbExclusionTypeLookup.pending.type]: (state) => {
      state.cmdbExclusionTypeLookup.loading = true;
    },
    [getCmdbExclusionTypeLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmdbExclusionTypeLookup.data = action.payload;
      state.cmdbExclusionTypeLookup.loading = false;
    },

    //Config Component lookup
    [getConfigComponentLookup.pending.type]: (state) => {
      state.configComponentLookup.loading = true;
    },
    [getConfigComponentLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.configComponentLookup.data = action.payload;
      state.configComponentLookup.loading = false;
    },

    //Config Table Column Component lookup
    [getConfigComponentTableColumnLookup.pending.type]: (state) => {
      state.configComponentTableColumnLookup.loading = true;
    },
    [getConfigComponentTableColumnLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.configComponentTableColumnLookup.data = action.payload;
      state.configComponentTableColumnLookup.loading = false;
    },

    // Expenditure Type lookup
    [getCmsExpenditureTypeLookup.pending.type]: (state) => {
      state.cmsExpenditureTypeLookup.loading = true;
    },
    [getCmsExpenditureTypeLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsExpenditureTypeLookup.data = action.payload;
      state.cmsExpenditureTypeLookup.loading = false;
    },

    // Category lookup
    [getCmsCategoryLookup.pending.type]: (state) => {
      state.cmsCategoryLookup.loading = true;
    },
    [getCmsCategoryLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsCategoryLookup.data = action.payload;
      state.cmsCategoryLookup.loading = false;
    },

    // CMS Purchase lookup
    [getCmsPurchaseLookup.pending.type]: (state) => {
      state.cmsPurchaseLookup.loading = true;
    },
    [getCmsPurchaseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsPurchaseLookup.data = action.payload;
      state.cmsPurchaseLookup.loading = false;
    },

    // CMS Category lookup
    [getCmsCategoryLookup.pending.type]: (state) => {
      state.cmsCategoryLookup.loading = true;
    },
    [getCmsCategoryLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsCategoryLookup.data = action.payload;
      state.cmsCategoryLookup.loading = false;
    },

    // CMS CategoryExtended lookup
    [getCmsCategoryExtendedLookup.pending.type]: (state) => {
      state.cmsCategoryExtendedLookup.loading = true;
    },
    [getCmsCategoryExtendedLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsCategoryExtendedLookup.data = action.payload;
      state.cmsCategoryExtendedLookup.loading = false;
    },

    // CMS Contract Agreement lookup
    [getCmsContractAgreementLookup.pending.type]: (state) => {
      state.cmsContractAgreementLookup.loading = true;
    },
    [getCmsContractAgreementLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsContractAgreementLookup.data = action.payload;
      state.cmsContractAgreementLookup.loading = false;
    },

    // CMS Contract lookup
    [getCmsContractLookup.pending.type]: (state) => {
      state.cmsContractLookup.loading = true;
    },
    [getCmsContractLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsContractLookup.data = action.payload;
      state.cmsContractLookup.loading = false;
    },

    // Users lookup
    [getUserLookup.pending.type]: (state) => {
      state.UserLookup.loading = true;
    },
    [getUserLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.UserLookup.data = action.payload;
      state.UserLookup.loading = false;
    },

    //CMS Contact lookup
    [getCmsContactLookup.pending.type]: (state) => {
      state.cmsContactLookup.loading = true;
    },
    [getCmsContactLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsContactLookup.data = action.payload;
      state.cmsContactLookup.loading = false;
    },

    //CMS Vector lookup
    [getCmsVectorLookup.pending.type]: (state) => {
      state.cmsVectorLookup.loading = true;
    },
    [getCmsVectorLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsVectorLookup.data = action.payload;
      state.cmsVectorLookup.loading = false;
    },

    //CMS Publisher lookup
    [getCmsPublisherLookup.pending.type]: (state) => {
      state.cmsPublisherLookup.loading = true;
    },
    [getCmsPublisherLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsPublisherLookup.data = action.payload;
      state.cmsPublisherLookup.loading = false;
    },

    //CMS TriggerType lookup
    [getCmsTriggerTypeLookup.pending.type]: (state) => {
      state.cmsTriggerTypeLookup.loading = true;
    },
    [getCmsTriggerTypeLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.cmsTriggerTypeLookup.data = action.payload;
      state.cmsTriggerTypeLookup.loading = false;
    },

    // Delete Dataset
    [deleteDataset.pending.type]: (state) => {
      state.deleteDataset.loading = true;
      state.deleteDataset.messages = [];
    },
    [deleteDataset.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = false;
      state.deleteDataset.messages = action.payload.messages;
    },
    [deleteDataset.rejected.type]: (state) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = true;
    },

    // Delete Bulk Dataset
    [bulkDelete.pending.type]: (state) => {
      state.bulkDelete.loading = true;
      state.bulkDelete.messages = [];
    },
    [bulkDelete.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.bulkDelete.loading = false;
      state.bulkDelete.hasErrors = false;
      state.bulkDelete.messages = action.payload.messages;
    },
    [bulkDelete.rejected.type]: (state) => {
      state.bulkDelete.loading = false;
      state.bulkDelete.hasErrors = true;
    },

    // Save Table Column Selection
    [saveTableColumnSelection.pending.type]: (state) => {
      state.saveTableColumnSelection.loading = true;
      state.saveTableColumnSelection.messages = [];
    },
    [saveTableColumnSelection.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveTableColumnSelection.loading = false;
      state.saveTableColumnSelection.hasErrors = false;
      state.saveTableColumnSelection.messages = action.payload.messages;
    },
    [saveTableColumnSelection.rejected.type]: (state) => {
      state.saveTableColumnSelection.loading = false;
      state.saveTableColumnSelection.hasErrors = true;
    },

    //SPS Api groups
    [getSpsApiGroups.pending.type]: (state) => {
      state.spsApiGroups.loading = true;
    },
    [getSpsApiGroups.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiGroups.data = action.payload;
      state.spsApiGroups.loading = false;
    },

    //SPS Api types
    [getSpsApiTypes.pending.type]: (state) => {
      state.spsApiTypes.loading = true;
    },
    [getSpsApiTypes.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.spsApiTypes.data = action.payload;
      state.spsApiTypes.loading = false;
    },
  },
});

// A selector
export const commonSelector = (state: RootState) => state.common;

// Actions
export const {
  clearCommon,
  clearBULookUp,
  clearCompanyLookUp,
  // setGlobalSearch,
  clearDeleteDatasetMessages,
  clearSaveTableColumnSelection,
  clearSpsApiGroupsLookup,
  clearSpsApiBaseUrlLookup,
  clearSpsApiTypesLookup,
  clearMultipleUpdateMessages,
  clearDateLookup,
  clearCronJobSchedularMessages,
  clearConfigModelPopUpDataSelection,
  cleargetModelPopUpDataSelection,
  clearSpsApiOAuthLookup,
  clearSpsApiUrlInjectionLookup,
  clearBulkDeleteMessage,
} = commonSlice.actions;

// The reducer
export default commonSlice.reducer;
