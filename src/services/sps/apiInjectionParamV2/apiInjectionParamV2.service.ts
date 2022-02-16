import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchSpsApiInjectionParamV2,
  ISpsApiInjectionParamV2,
} from './apiInjectionParamV2.model';

class SpsApiInjectionParamService {
  ENDPOINT = '/sps-api-injection-param-v2';

  public async searchSpsApiInjectionParamV2(
    searchParams?: ISearchSpsApiInjectionParamV2
  ): Promise<IApiResponse<ISearchResponse<ISpsApiInjectionParamV2>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiInjectionParamV2ById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiInjectionParamV2(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/get-by-api-type/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSpsApiInjectionParamV2(data: ISpsApiInjectionParamV2): Promise<any> {
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

  public async deleteSpsApiInjectionParamV2(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiInjectionParamV2): Promise<any> {
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
export default new SpsApiInjectionParamService();
