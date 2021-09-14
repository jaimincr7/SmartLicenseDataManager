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
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSpsApiJobsData): Promise<any> {
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
export default new SpsApiJobsDataService();
