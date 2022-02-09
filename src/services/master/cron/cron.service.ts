import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICron, ICronData, ISearchCron, IStartApi } from './cron.model';

class CronService {
  ENDPOINT = '/sps-scheduler';

  public async searchCron(
    searchParams?: ISearchCron
  ): Promise<IApiResponse<ISearchResponse<ICron>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async startAll(searchParams?: ISearchCron): Promise<IApiResponse<ISearchResponse<ICron>>> {
    const url = `${this.ENDPOINT}/start-all`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getCronById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getFrequencyDay(): Promise<any> {
    const url = `${this.ENDPOINT}/weekdays-month-day-lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveCron(data: ICronData): Promise<any> {
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

  public async deleteCron(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
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
