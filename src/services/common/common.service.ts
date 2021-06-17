import { IApiResponse } from '../../common/models/commont';
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
}
export default new CommonService();