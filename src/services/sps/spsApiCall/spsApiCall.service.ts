import axios from 'axios';
import { toast } from 'react-toastify';
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
    const cancelTokenSource = axios.CancelToken.source();

    return new Promise((resolve, reject) => {
      request({ url, method: 'POST', data: data, cancelToken: cancelTokenSource.token }).then((res) => {
        return res?.data;
      }).then(data => {
        resolve(data);
      })
      setTimeout(() => {
        // Cancel request
        cancelTokenSource.cancel();
        toast.warning('Process is working in background.');
        reject();
      }, (30 * 1000));  // wait till 30 seconds 
    });
  }

  public async callAllApi(searchParams?: ICallAllApi): Promise<IApiResponse<{}>> {
    const url = `${this.ENDPOINT}/call-all-api`;

    const cancelTokenSource = axios.CancelToken.source();

    return new Promise((resolve, reject) => {
      request({ url, method: 'POST', data: searchParams, cancelToken: cancelTokenSource.token }).then((res) => {
        return res?.data;
      }).then(data => {
        resolve(data);
      })
      setTimeout(() => {
        // Cancel request
        cancelTokenSource.cancel();
        toast.warning('Process is working in background.');
        reject();
      }, (30 * 1000));  // wait till 30 seconds 
    });
  }
}
export default new SPSApiCallService();
