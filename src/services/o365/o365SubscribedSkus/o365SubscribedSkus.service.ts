import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { IO365SubscribedSkus, ISearchO365SubscribedSkus } from './o365SubscribedSkus.model';

class O365SubscribedSkusService {
  ENDPOINT = '/o365-subscribed-skus';

  public async searchO365SubscribedSkus(
    searchParams?: ISearchO365SubscribedSkus
  ): Promise<IApiResponse<ISearchResponse<IO365SubscribedSkus>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getO365SubscribedSkusById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveO365SubscribedSkus(data: IO365SubscribedSkus): Promise<any> {
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

  public async deleteO365SubscribedSkus(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchO365SubscribedSkus): Promise<any> {
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

export default new O365SubscribedSkusService();
