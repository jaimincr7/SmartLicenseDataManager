import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchConfigOnlineServicePlans,
  IConfigOnlineServicePlans,
} from './onlineServicePlans.model';

class ConfigOnlineServicePlansService {
  ENDPOINT = '/config-online-service-plans';

  public async searchConfigOnlineServicePlans(
    searchParams?: ISearchConfigOnlineServicePlans
  ): Promise<IApiResponse<ISearchResponse<IConfigOnlineServicePlans>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getConfigOnlineServicePlansById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveConfigOnlineServicePlans(data: IConfigOnlineServicePlans): Promise<any> {
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

  public async deleteConfigOnlineServicePlans(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchConfigOnlineServicePlans): Promise<any> {
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
export default new ConfigOnlineServicePlansService();
