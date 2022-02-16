import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchSpsApiOauthUrlInjectionSite,
  ISpsApiOauthUrlInjectionSite,
} from './apiOauthUrlInjectionSite.model';

class SpsApiOauthUrlInjectionSiteService {
  ENDPOINT = '/sps-api-oauth-url-injection-site';

  public async searchSpsApiOauthUrlInjectionSite(
    searchParams?: ISearchSpsApiOauthUrlInjectionSite
  ): Promise<IApiResponse<ISearchResponse<ISpsApiOauthUrlInjectionSite>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiOauthUrlInjectionSiteById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSpsApiOauthUrlInjectionSite(data: ISpsApiOauthUrlInjectionSite): Promise<any> {
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

  public async deleteSpsApiOauthUrlInjectionSite(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiOauthUrlInjectionSite): Promise<any> {
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
export default new SpsApiOauthUrlInjectionSiteService();
