import axios from 'axios';
import { IApiResponse, ITableColumnSelection } from '../../common/models/common';
import request from '../../utils/request';
import {
  IBulkDelete,
  IBulkInsertDataset,
  IBulkUpdate,
  IConfigModelPopUpDataSelection,
  IDeleteDataset,
  IGetConfigModelPopUpDataSelection,
  ILookup,
  IScheduleDate,
} from './common.model';

class CommonService {
  cancelTokenSource = null;

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

  public async getApiTypeV2Lookup(data: any): Promise<IApiResponse<ILookup>> {
    const url = `/sps-api-oauth-v2/api-type-global-dd`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getOAuthV2IdLookup(data: any): Promise<IApiResponse<ILookup>> {
    const url = `/sps-api-oauth-v2/api-type-base-oauth`;
    return request({ url, method: 'POST', data: data }).then((res) => {
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

  public async getScheduleDateforWindowsServer(data: IScheduleDate): Promise<IApiResponse<any>> {
    const url = `/app/get-date-added`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getScheduleDateforSqlServer(data: IScheduleDate): Promise<IApiResponse<any>> {
    const url = `/app/get-date-added`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async configModelPopUpDataSelection(
    data: IConfigModelPopUpDataSelection
  ): Promise<IApiResponse<any>> {
    const url = `/config-model-pop-up-data-selection`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getConfigModelPopUpDataSelection(
    data: IGetConfigModelPopUpDataSelection
  ): Promise<IApiResponse<any>> {
    const url = `/config-model-pop-up-data-selection/model-pop-up-selection`;
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

  public async getProccessRunning(): Promise<IApiResponse<ILookup>> {
    const url = `/back-ground-processes/get-pending-back-ground-process-details`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSoftwareNormalizationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-software-normalization/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getOSNormalizationLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/cmdb-os-normalization/lookup`;
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

  public async errorLog(obj: any): Promise<IApiResponse<any>> {
    const url = `/error-log`;
    const data = obj;
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }

  public async getColumnLookup(obj: {}): Promise<IApiResponse<any>> {
    const url = `/app/column-lookup`;
    const data = obj;
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }

  public async getExcelColumns(
    file: any,
    callbackProgress?: any,
    tenant_id?: number,
    company_id?: number,
    bu_id?: number
  ): Promise<IApiResponse<any>> {
    this.cancelTokenSource = axios.CancelToken.source();
    const headers = { Accept: 'multipart/form-data' };
    let url = `/app/read-excel-file`;
    if (tenant_id !== null) {
      url = `/app/read-excel-file?tenant_id=${tenant_id}`;
      if (company_id !== null) {
        url = `/app/read-excel-file?tenant_id=${tenant_id}&company_id=${company_id}`;
        if (bu_id !== null) {
          url = `/app/read-excel-file?tenant_id=${tenant_id}&company_id=${company_id}&bu_id=${bu_id}`;
        }
      }
    }

    return new Promise((resolve, reject) => {
      //  if (cancelTokenSource !== null) {
      //    console.log(cancelTokenSource);
      //    callbackProgress(null);
      //    cancelTokenSource.cancel();
      //    reject();
      //  }
      // setTimeout(() => {
      //   // Cancel request
      //   cancelTokenSource.cancel();
      //   reject();
      // }, 5 * 1000);

      request({
        url,
        method: 'POST',
        data: file,
        headers: headers,
        cancelToken: this.cancelTokenSource.token,
        onUploadProgress: (data) => {
          if (callbackProgress) {
            const current = Math.round((100 * data.loaded) / data.total);
            callbackProgress(current);
          }
        },
      })
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          resolve(data);
        })
        .catch((data) => {
          reject(data);
        })
        .finally(() => {
          callbackProgress(null);
        });
    });
  }

  public async getCSVExcelColumns(file: any): Promise<IApiResponse<any>> {
    const url = `/app/read-csv-file-delimiter`;

    return request({ url, method: 'POST', data: file }).then((res) => {
      return res.data;
    });
  }

  public async deleteFileForBulkImport(fileName: string[]): Promise<IApiResponse<any>> {
    const data = {
      files: fileName,
    };
    const url = `/app/delete-file/`;
    return request({ url, method: 'POST', data: data }).then((res) => {
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
    const url = `/back-ground-processes/bulk-insert`;
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

  public async getJwtTokenForSocket(httpRequest): Promise<IApiResponse<any>> {
    const url = `/app/jwt-token`;
    return httpRequest({ url, method: 'GET' }).then((res) => {
      return res?.data;
    });
  }

  public async deleteDataset(data: IDeleteDataset): Promise<any> {
    const inputValues = { ...data, debug: false };
    const url = `/back-ground-processes/delete-dataset`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async updateMultiple(searchParams?: IBulkUpdate): Promise<any> {
    const url = `/back-ground-processes/bulk-update`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async bulkDelete(searchParams?: IBulkDelete): Promise<any> {
    const url = `/back-ground-processes/bulk-delete`;
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

  public async getSpsApiBaseUrl(): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-base-url/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiOAuth(): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-oauth/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiUrlInjection(): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-oauth-url-injection-site/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiUrlInjectionV2(id: number): Promise<IApiResponse<ILookup[]>> {
    const url = `/sps-api-injection-param-v2/get-by-api-type/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getTablesForDelete(): Promise<IApiResponse<ILookup[]>> {
    const url = `/config-delete-data-set/all`;
    return request({ url, method: 'GET' }).then((res) => {
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
