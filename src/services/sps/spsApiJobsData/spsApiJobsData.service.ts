import axios from 'axios';
import { toast } from 'react-toastify';
import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICallAPI, ISearchSpsApiJobsData, ISpsApiJobsData } from './spsApiJobsData.model';

class SpsApiJobsDataService {
  ENDPOINT = '/sps-api-jobs-data';

  public async searchSpsApiJobsData(
    searchParams?: ISearchSpsApiJobsData
  ): Promise<IApiResponse<ISearchResponse<ISpsApiJobsData>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async runJobData(data: ICallAPI): Promise<any> {
    const url = `${this.ENDPOINT}/run-job-data`;
    const cancelTokenSource = axios.CancelToken.source();

    return new Promise((resolve, reject) => {
      const timmer = setTimeout(() => {
        // Cancel request
        cancelTokenSource.cancel();
        toast.warning('Process is working in background.');
        reject();
      }, 30 * 1000); // wait till 30 seconds

      request({ url, method: 'POST', data: data, cancelToken: cancelTokenSource.token })
        .then((res) => {
          return res?.data;
        })
        .then((data) => {
          resolve(data);
        })
        .catch((data) => {
          reject(data);
        })
        .finally(() => {
          clearTimeout(timmer);
        });
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiJobsData): Promise<any> {
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
export default new SpsApiJobsDataService();
