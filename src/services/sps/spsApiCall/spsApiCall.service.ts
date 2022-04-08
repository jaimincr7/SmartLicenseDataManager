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

  public async checkUID(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/check-uid-selection/${id}`;
    return request({ url, method: 'POST' }).then((res) => {
      return res.data;
    });
  }

  public async callApi(data: ICallAPI): Promise<any> {
    const url = `back-ground-processes/call-api`;

    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
    // const cancelTokenSource = axios.CancelToken.source();

    // return new Promise((resolve, reject) => {
    //   const timmer = setTimeout(() => {
    //     // Cancel request
    //     cancelTokenSource.cancel();
    //     toast.warning('Process is working in background.');
    //     reject();
    //   }, 30 * 1000); // wait till 30 seconds

    //   request({ url, method: 'POST', data: data, cancelToken: cancelTokenSource.token })
    //     .then((res) => {
    //       return res?.data;
    //     })
    //     .then((data) => {
    //       resolve(data);
    //     })
    //     .catch((data) => {
    //       reject(data);
    //     })
    //     .finally(() => {
    //       clearTimeout(timmer);
    //     });
    // });
  }

  public async callAllApi(searchParams?: ICallAllApi): Promise<IApiResponse<{}>> {
    const url = `back-ground-processes/call-all-api`;

    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });

    // const cancelTokenSource = axios.CancelToken.source();

    // return new Promise((resolve, reject) => {
    //   const timmer = setTimeout(() => {
    //     // Cancel request
    //     cancelTokenSource.cancel();
    //     toast.warning('Process is working in background.');
    //     reject();
    //   }, 30 * 1000); // wait till 30 seconds

    //   request({ url, method: 'POST', data: searchParams, cancelToken: cancelTokenSource.token })
    //     .then((res) => {
    //       return res?.data;
    //     })
    //     .then((data) => {
    //       resolve(data);
    //     })
    //     .catch((data) => {
    //       reject(data);
    //     })
    //     .finally(() => {
    //       clearTimeout(timmer);
    //     });
    // });
  }
}
export default new SPSApiCallService();
