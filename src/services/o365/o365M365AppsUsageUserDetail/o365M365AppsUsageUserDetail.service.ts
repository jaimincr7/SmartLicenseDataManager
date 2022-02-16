import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchO365M365AppsUsageUserDetail,
  IO365M365AppsUsageUserDetail,
} from './o365M365AppsUsageUserDetail.model';

class O365M365AppsUsageUserDetailService {
  ENDPOINT = '/o365-m365-apps-usage-user-detail';

  public async searchO365M365AppsUsageUserDetail(
    searchParams?: ISearchO365M365AppsUsageUserDetail
  ): Promise<IApiResponse<ISearchResponse<IO365M365AppsUsageUserDetail>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getO365M365AppsUsageUserDetailById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveO365M365AppsUsageUserDetail(data: IO365M365AppsUsageUserDetail): Promise<any> {
    const { id, ...restData } = data;
    if (id > 0) {
      const url = `${this.ENDPOINT}/${id}`;
      return request({ url, method: 'PUT', data: restData }).then((res) => {
        return res.data;
      });
    } else {
      const url = `${this.ENDPOINT}`;
      return request({ url, method: 'POST', data: restData }).then((res) => {
        return res.data;
      });
    }
  }

  public async deleteO365M365AppsUsageUserDetail(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchO365M365AppsUsageUserDetail): Promise<any> {
    const url = `back-ground-processes/export-excel`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }
}
export default new O365M365AppsUsageUserDetailService();
