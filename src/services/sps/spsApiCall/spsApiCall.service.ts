import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICallAllApi, ICallAPI, ISearchAPI, ISearchImportAPIs } from './spsApiCall.model';

class SPSApiCallService {
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
}
export default new SPSApiCallService();
