import { IApiResponse, ITableColumnSelection } from '../../common/models/common';
import request from '../../utils/request';
import {
  IBulkInsertDataset,
  IBulkUpdate,
  IDeleteDataset,
  ILookup,
  IScheduleDate,
} from './common.model';

class CommonService {
  public async getTenantLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/tenant/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCompanyLookup(tenantId: number): Promise<IApiResponse<ILookup>> {
    const url = `/company/lookup/${tenantId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCronFormula(): Promise<IApiResponse<ILookup>> {
    const url = `/config-cron-job-frequency/lookup/`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAllCompanyLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/company/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getBULookup(companyId: number): Promise<IApiResponse<ILookup>> {
    const url = `/bu/lookup/${companyId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getScheduleDate(data: IScheduleDate): Promise<IApiResponse<any>> {
    const url = `/app/get-date-added`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getSqlServerLicenseLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-sql-server-license/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAgreementTypesLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/agreement-types/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCurrencyLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/currency/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getWindowsServerLicenseLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-windows-server-license/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbDeviceLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-device/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbUserLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-user/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getO365ProductsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-o365-products/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiGroupLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/sps-api-group/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiTypeLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/sps-api-type/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigSqlServerEditionsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-sql-server-editions/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigSqlServerVersionsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-sql-server-versions/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigSqlServerServicesLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-sql-server-services/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigWindowsServerEditionsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-windows-server-editions/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigWindowsServerVersionsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-windows-server-versions/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigWindowsServerServicesLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-windows-server-services/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigLicenseUnitsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-license-units/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigSupportTypesLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-support-types/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigOnlineProductsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-online-products/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigOnlineServicePlansLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-online-service-plans/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbLicenseModelLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-license-model/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbExclusionComponentLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-exclusion-component/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbApplicationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-application/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbExclusionLocationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-exclusion-location/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbOperatingSystemLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-operating-system/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbExclusionOperationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-exclusion-operation/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbProcessorLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-processor/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbVirtualizationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-virtualization/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigComponentLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-component/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigComponentTableColumnLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-component-table-column/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbExclusionTypeLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-exclusion-type/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsExpenditureTypeLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-expenditure-type/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsPurchaseLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-purchase/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsCategoryLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-category/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsCategoryExtendedLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-category-extended/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsContractAgreementLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-contract-agreement/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsContactLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-contact/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsVectorLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-vendor/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsTriggerTypeLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-trigger-type/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsPublisherLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-vendor/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getCmsContractLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cms-contract/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getUserLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/user/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getColumnLookup(tableName: string, columnName: string,filter_keys: any[],keywords: string): Promise<IApiResponse<any>> {
    const url = `/app/column-lookup`;
    const data = {
      table_name: tableName,
      column_name: columnName,
      filter_keys: filter_keys,
      keywords: keywords
    };
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }

  public async getExcelColumns(file: any): Promise<IApiResponse<any>> {
    const headers = { Accept: 'multipart/form-data' };
    const url = `/app/read-excel-file`;
    // const formData = new FormData();
    // formData.append('file', file);
    return request({ url, method: 'POST', data: file, headers: headers }).then((res) => {
      return res.data;
    });
  }

  // Bulk import
  public async getTableColumns(tableName: string): Promise<IApiResponse<any>> {
    const url = `/app/table-column/${
      tableName?.includes('/') ? encodeURIComponent(tableName) : tableName
    }`;
    return request({ url, method: 'GET' }).then((res) => {
      if (res.data?.body.data?.identity_column) {
        const response = res.data?.body.data?.column_data.filter(
          (x) => x.name !== res.data?.body.data?.identity_column
        );
        return response;
      } else {
        return res.data?.body.data?.column_data;
      }
    });
  }

  public async bulkInsert(data: IBulkInsertDataset): Promise<IApiResponse<any>> {
    const url = `/app/bulk-insert`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getDatabaseTables(): Promise<IApiResponse<any>> {
    const url = `/app/tables`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async deleteDataset(data: IDeleteDataset): Promise<any> {
    const inputValues = { ...data, debug: false };
    const url = `/app/delete-dataset`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async updateMultiple(searchParams?: IBulkUpdate): Promise<any> {
    const url = `/app/bulk-update`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async saveTableColumnSelection(data: ITableColumnSelection): Promise<any> {
    const inputValues = {
      ...data,
      columns: JSON.stringify({ columns: data.columns, column_orders: data.column_orders }),
    };
    const url = `/table-column-selection`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiGroups(): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-group/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiTypes(): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-type/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }
}
export default new CommonService();
