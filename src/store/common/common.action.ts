import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITableColumnSelection } from '../../common/models/common';
import { IDeleteDataset } from '../../services/common/common.model';
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

export const getBULookup = createAsyncThunk('getBULookup', async (companyId: number) => {
  const response = await commonService.getBULookup(companyId).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSqlServerLicenseLookup = createAsyncThunk('getSqlServerLicenseLookup', async () => {
  const response = await commonService.getSqlServerLicenseLookup().then((res) => {
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

export const getCmdbOperatingSystemLookup = createAsyncThunk(
  'getCmdbOperatingSystemLookup',
  async () => {
    const response = await commonService.getCmdbOperatingSystemLookup().then((res) => {
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

export const getCmdbVirtualizationLookup = createAsyncThunk(
  'getCmdbVirtualizationLookup',
  async () => {
    const response = await commonService.getCmdbVirtualizationLookup().then((res) => {
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
