import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchSpsApiInjectionValueParamV2,
  ISpsApiInjectionValueParamV2,
} from './apiInjectionValueParamV2.model';

class SpsApiInjectionValueParamService {
  ENDPOINT = '/sps-api-injection-value-v2';

  public async searchSpsApiInjectionValueParamV2(
    searchParams?: ISearchSpsApiInjectionValueParamV2
  ): Promise<IApiResponse<ISearchResponse<ISpsApiInjectionValueParamV2>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiInjectionValueParamV2ById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSpsApiInjectionValueParamV2(data: ISpsApiInjectionValueParamV2): Promise<any> {
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

  public async deleteSpsApiInjectionValueParamV2(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiInjectionValueParamV2): Promise<any> {
    const url = `${this.ENDPOINT}/search`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
      responseType: 'blob' as 'json',
    }).then((res) => {
      return res;
    });
  }
}
export default new SpsApiInjectionValueParamService();
