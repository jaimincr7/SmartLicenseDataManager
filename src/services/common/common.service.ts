import { IApiResponse } from '../../common/models/common';
import request from '../../utils/request';
import { ILookup } from './common.model';

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

  public async getBULookup(companyId: number): Promise<IApiResponse<ILookup>> {
    const url = `/bu/lookup/${companyId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getLicenseLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/sql-server-license/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getColumnLookup(tableName:string, columnName: string): Promise<IApiResponse<any>> {
    const url = `/app/column-lookup`;
    const data = {
      table_name: tableName,
      column_name: columnName
    }
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }
}
export default new CommonService();
