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
  allCompanyLookup: {
    data: [],
    loading: false,
  },
  buLookup: {
    data: [],
    loading: false,
  },
  sqlServerLicenseLookup: {
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
  saveTableColumnSelection: {
    loading: false,
    hasErrors: false,
    messages: [],
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
    clearCommon: () => {
      return initialState;
    },
    clearSaveTableColumnSelection: (state) => {
      state.saveTableColumnSelection.messages = [];
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

    // Company lookup
    [getCompanyLookup.pending.type]: (state) => {
      state.companyLookup.loading = true;
    },
    [getCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.companyLookup.data = action.payload;
      state.companyLookup.loading = false;
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

    // Sql Server License lookup
    [getSqlServerLicenseLookup.pending.type]: (state) => {
      state.sqlServerLicenseLookup.loading = true;
    },
    [getSqlServerLicenseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.sqlServerLicenseLookup.data = action.payload;
      state.sqlServerLicenseLookup.loading = false;
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
} = commonSlice.actions;

// The reducer
export default commonSlice.reducer;
