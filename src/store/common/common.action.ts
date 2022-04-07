import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITableColumnSelection } from '../../common/models/common';
import {
  IBulkDelete,
  IBulkUpdate,
  IConfigModelPopUpDataSelection,
  IDeleteDataset,
  IGetConfigModelPopUpDataSelection,
  IScheduleDate,
} from '../../services/common/common.model';
import commonService from '../../services/common/common.service';

// Asynchronous thunk action

export const getTenantLookup = createAsyncThunk('getTenantLookup', async () => {
  const response = await commonService.getTenantLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCompanyLookup = createAsyncThunk('getCompanyLookup', async (tenantId: number) => {
  const response = await commonService.getCompanyLookup(tenantId).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getAllCompanyLookup = createAsyncThunk('getAllCompanyLookup', async () => {
  const response = await commonService.getAllCompanyLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const configModelPopUpDataSelection = createAsyncThunk(
  'configModelPopUpDataSelection',
  async (data: IConfigModelPopUpDataSelection) => {
    const response = await commonService.configModelPopUpDataSelection(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const getApiTypeV2Lookup = createAsyncThunk('getApiTypeV2Lookup', async (data: any) => {
  const response = await commonService.getApiTypeV2Lookup(data).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getOAuthV2IdLookup = createAsyncThunk('getOAuthV2IdLookup', async (data: any) => {
  const response = await commonService.getOAuthV2IdLookup(data).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getConfigModelPopUpDataSelection = createAsyncThunk(
  'getConfigModelPopUpDataSelection',
  async (data: IGetConfigModelPopUpDataSelection) => {
    const response = await commonService.getConfigModelPopUpDataSelection(data).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getBULookup = createAsyncThunk('getBULookup', async (companyId: number) => {
  const response = await commonService.getBULookup(companyId).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getScheduleDate = createAsyncThunk('getScheduleDate', async (data: IScheduleDate) => {
  const response = await commonService.getScheduleDate(data).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getScheduleDateforWindowsServer = createAsyncThunk(
  'getScheduleDateforWindowsServer',
  async (data: IScheduleDate) => {
    const response = await commonService.getScheduleDateforWindowsServer(data).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getScheduleDateforSqlServer = createAsyncThunk(
  'getScheduleDateforSqlServer',
  async (data: IScheduleDate) => {
    const response = await commonService.getScheduleDateforSqlServer(data).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSqlServerLicenseLookup = createAsyncThunk('getSqlServerLicenseLookup', async () => {
  const response = await commonService.getSqlServerLicenseLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSoftwareNormalizationLookup = createAsyncThunk(
  'getSoftwareNormalizationLookup',
  async () => {
    const response = await commonService.getSoftwareNormalizationLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getProccessRunning = createAsyncThunk('getProccessRunning', async () => {
  const response = await commonService.getProccessRunning().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getOSNormalizationLookup = createAsyncThunk('getOSNormalizationLookup', async () => {
  const response = await commonService.getOSNormalizationLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getAgreementTypesLookup = createAsyncThunk('getAgreementTypesLookup', async () => {
  const response = await commonService.getAgreementTypesLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCurrencyLookup = createAsyncThunk('getCurrencyLookup', async () => {
  const response = await commonService.getCurrencyLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getWindowsServerLicenseLookup = createAsyncThunk(
  'getWindowsServerLicenseLookup',
  async () => {
    const response = await commonService.getWindowsServerLicenseLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbUserLookup = createAsyncThunk('getCmdbUserLookup', async () => {
  const response = await commonService.getCmdbUserLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getO365ProductsLookup = createAsyncThunk('getO365ProductsLookup', async () => {
  const response = await commonService.getO365ProductsLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiGroupLookup = createAsyncThunk('getSpsApiGroupLookup', async () => {
  const response = await commonService.getSpsApiGroupLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiOAuthLookup = createAsyncThunk('getSpsApiOAuthLookup', async () => {
  const response = await commonService.getSpsApiOAuth().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiUrlInjectionLookup = createAsyncThunk(
  'getSpsApiUrlInjectionLookup',
  async () => {
    const response = await commonService.getSpsApiUrlInjection().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiUrlInjectionV2Lookup = createAsyncThunk(
  'getSpsApiUrlInjectionV2Lookup',
  async (id: number) => {
    const response = await commonService.getSpsApiUrlInjectionV2(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTablesForDelete = createAsyncThunk('getTablesForDelete', async () => {
  const response = await commonService.getTablesForDelete().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiTypeLookup = createAsyncThunk('getSpsApiTypeLookup', async () => {
  const response = await commonService.getSpsApiTypeLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getConfigSqlServerEditionsLookup = createAsyncThunk(
  'getConfigSqlServerEditionsLookup',
  async () => {
    const response = await commonService.getConfigSqlServerEditionsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigSqlServerServicesLookup = createAsyncThunk(
  'getConfigSqlServerServicesLookup',
  async () => {
    const response = await commonService.getConfigSqlServerServicesLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigSqlServerVersionsLookup = createAsyncThunk(
  'getConfigSqlServerVersionsLookup',
  async () => {
    const response = await commonService.getConfigSqlServerVersionsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigWindowsServerEditionsLookup = createAsyncThunk(
  'getConfigWindowsServerEditionsLookup',
  async () => {
    const response = await commonService.getConfigWindowsServerEditionsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigWindowsServerServicesLookup = createAsyncThunk(
  'getConfigWindowsServerServicesLookup',
  async () => {
    const response = await commonService.getConfigWindowsServerServicesLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigWindowsServerVersionsLookup = createAsyncThunk(
  'getConfigWindowsServerVersionsLookup',
  async () => {
    const response = await commonService.getConfigWindowsServerVersionsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigLicenseUnitsLookup = createAsyncThunk(
  'getConfigLicenseUnitsLookup',
  async () => {
    const response = await commonService.getConfigLicenseUnitsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigSupportTypesLookup = createAsyncThunk(
  'getConfigSupportTypesLookup',
  async () => {
    const response = await commonService.getConfigSupportTypesLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigOnlineProductsLookup = createAsyncThunk(
  'getConfigOnlineProductsLookup',
  async () => {
    const response = await commonService.getConfigOnlineProductsLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigOnlineServicePlansLookup = createAsyncThunk(
  'getConfigOnlineServicePlansLookup',
  async () => {
    const response = await commonService.getConfigOnlineServicePlansLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbLicenseModelLookup = createAsyncThunk('getCmdbLicenseModelLookup', async () => {
  const response = await commonService.getCmdbLicenseModelLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmdbExclusionComponentLookup = createAsyncThunk(
  'getCmdbExclusionComponentLookup',
  async () => {
    const response = await commonService.getCmdbExclusionComponentLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbOperatingSystemLookup = createAsyncThunk(
  'getCmdbOperatingSystemLookup',
  async () => {
    const response = await commonService.getCmdbOperatingSystemLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigComponentLookup = createAsyncThunk('getConfigComponentLookup', async () => {
  const response = await commonService.getConfigComponentLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getConfigComponentTableColumnLookup = createAsyncThunk(
  'getConfigComponentTableColumnLookup',
  async () => {
    const response = await commonService.getConfigComponentTableColumnLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbApplicationLookup = createAsyncThunk('getCmdbApplicationLookup', async () => {
  const response = await commonService.getCmdbApplicationLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmdbExclusionOperationLookup = createAsyncThunk(
  'getCmdbExclusionOperationLookup',
  async () => {
    const response = await commonService.getCmdbExclusionOperationLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbProcessorLookup = createAsyncThunk('getCmdbProcessorLookup', async () => {
  const response = await commonService.getCmdbProcessorLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmdbExclusionLocationLookup = createAsyncThunk(
  'getCmdbExclusionLocationLookup',
  async () => {
    const response = await commonService.getCmdbExclusionLocationLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbVirtualizationLookup = createAsyncThunk(
  'getCmdbVirtualizationLookup',
  async () => {
    const response = await commonService.getCmdbVirtualizationLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbDeviceLookup = createAsyncThunk('getCmdbDeviceLookup', async () => {
  const response = await commonService.getCmdbDeviceLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmdbExclusionTypeLookup = createAsyncThunk(
  'getCmdbExclusionTypeLookup',
  async () => {
    const response = await commonService.getCmdbExclusionTypeLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsExpenditureTypeLookup = createAsyncThunk('getCmsExpenditureType', async () => {
  const response = await commonService.getCmsExpenditureTypeLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsPurchaseLookup = createAsyncThunk('getCmsPurchase', async () => {
  const response = await commonService.getCmsPurchaseLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsCategoryLookup = createAsyncThunk('getCmsCategory', async () => {
  const response = await commonService.getCmsCategoryLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsCategoryExtendedLookup = createAsyncThunk('getCmsCategoryExtended', async () => {
  const response = await commonService.getCmsCategoryExtendedLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsContractAgreementLookup = createAsyncThunk(
  'getCmsContractAgreement',
  async () => {
    const response = await commonService.getCmsContractAgreementLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const updateMultiple = createAsyncThunk('updateMultiple', async (data: IBulkUpdate) => {
  const response = await commonService.updateMultiple(data).then((res) => {
    return res.body;
  });
  return response;
});

export const bulkDelete = createAsyncThunk('bulkDelete', async (data: IBulkDelete) => {
  const response = await commonService.bulkDelete(data).then((res) => {
    return res.body;
  });
  return response;
});

export const getCmsContactLookup = createAsyncThunk('getCmsContact', async () => {
  const response = await commonService.getCmsContactLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsVectorLookup = createAsyncThunk('getCmsVector', async () => {
  const response = await commonService.getCmsVectorLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsTriggerTypeLookup = createAsyncThunk('getCmsTriggerType', async () => {
  const response = await commonService.getCmsTriggerTypeLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsPublisherLookup = createAsyncThunk('getCmsPublisher', async () => {
  const response = await commonService.getCmsPublisherLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCmsContractLookup = createAsyncThunk('getCmsContract', async () => {
  const response = await commonService.getCmsContractLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getUserLookup = createAsyncThunk('getUser', async () => {
  const response = await commonService.getUserLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const deleteDataset = createAsyncThunk('deleteDataset', async (data: IDeleteDataset) => {
  const response = await commonService.deleteDataset(data).then((res) => {
    return res.body;
  });
  return response;
});

export const saveTableColumnSelection = createAsyncThunk(
  'saveTableColumnSelection',
  async (data: ITableColumnSelection) => {
    const response = await commonService.saveTableColumnSelection(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const getSpsApiBaseUrl = createAsyncThunk('getSpsApiBaseUrl', async () => {
  const response = await commonService.getSpsApiBaseUrl().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiGroups = createAsyncThunk('getSpsApiGroups', async () => {
  const response = await commonService.getSpsApiGroups().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSpsApiTypes = createAsyncThunk('getSpsApiTypes', async () => {
  const response = await commonService.getSpsApiTypes().then((res) => {
    return res.body;
  });
  return response.data;
});
