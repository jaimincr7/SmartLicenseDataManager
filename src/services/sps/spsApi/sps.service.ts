import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICallAPI, ISearchAPI, ISearchImportAPIs } from './sps.model';

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
    const url = `${this.ENDPOINT}/call-apis`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }
}
export default new SPSService();
