import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchSpsApiTokenConfigOptionsV2,
  ISpsApiTokenConfigOptionsV2,
} from './apiTokenConfigOptionsV2.model';

class SpsApiTokenConfigOptionsService {
  ENDPOINT = '/sps-api-token-config-options-v2';

  public async searchSpsApiTokenConfigOptionsV2(
    searchParams?: ISearchSpsApiTokenConfigOptionsV2
  ): Promise<IApiResponse<ISearchResponse<ISpsApiTokenConfigOptionsV2>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiTokenConfigOptionsV2ById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSpsApiTokenConfigOptionsV2(data: ISpsApiTokenConfigOptionsV2): Promise<any> {
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

  public async deleteSpsApiTokenConfigOptionsV2(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiTokenConfigOptionsV2): Promise<any> {
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
export default new SpsApiTokenConfigOptionsService();
