import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICallAllApi, ICallAPI, ISearchAPI, ISearchImportAPIs, ISpsApi } from './sps.model';

class SPSService {
  ENDPOINT = '/sps-api';

  public async searchImportAPIs(
    searchParams?: ISearchImportAPIs
  ): Promise<IApiResponse<ISearchResponse<ISearchAPI>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async callApi(data: ICallAPI): Promise<any> {
    const url = `${this.ENDPOINT}/call-api`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async callAllApi(searchParams?: ICallAllApi): Promise<IApiResponse<{}>> {
    const url = `${this.ENDPOINT}/call-all-api`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSpsApiById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSpsApi(data: ISpsApi): Promise<any> {
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

  public async deleteSpsApi(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }
}
export default new SPSService();
