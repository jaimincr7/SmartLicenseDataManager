import { IApiResponse, ITableColumnSelection } from '../../common/models/common';
import request from '../../utils/request';
import { IBulkInsertDataset, IDeleteDataset, ILookup } from './common.model';

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

  public async getO365ProductsLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/config-o365-products/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getColumnLookup(tableName: string, columnName: string): Promise<IApiResponse<any>> {
    const url = `/app/column-lookup`;
    const data = {
      table_name: tableName,
      column_name: columnName,
    };
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }

  public async getExcelColumns(file: File): Promise<IApiResponse<any>> {
    const headers = { Accept: 'multipart/form-data' };
    const url = `/app/excel-sheet-column`;
    const formData = new FormData();
    formData.append('file', file);
    return request({ url, method: 'POST', data: formData, headers: headers }).then((res) => {
      return res.data;
    });
  }

  // Bulk import
  public async getTableColumns(tableName: string): Promise<IApiResponse<any>> {
    const url = `/app/table-column/${tableName}`;
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
}
export default new CommonService();
