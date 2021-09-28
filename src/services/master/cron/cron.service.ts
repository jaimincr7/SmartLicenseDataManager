import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICron, ISearchCron, IStartApi } from './cron.model';

class CronService {
  ENDPOINT = '/cron-job-data';

  public async searchCron(
    searchParams?: ISearchCron
  ): Promise<IApiResponse<ISearchResponse<ICron>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  // public async startApi(searchParams?: IStartApi): Promise<any> {
  //   const url = `${this.ENDPOINT}/start`;
  //   return request({ url, method: 'POST', data: searchParams }).then((res) => {
  //     return res.data;
  //   });
  // }

  public async startApi(searchParams: IStartApi): Promise<any> {
    const url = `${this.ENDPOINT}/start`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async stopApi(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/stop/${id}`;
    return request({ url, method: 'POST' }).then((res) => {
      return res.data;
    });
  }
}
export default new CronService();
