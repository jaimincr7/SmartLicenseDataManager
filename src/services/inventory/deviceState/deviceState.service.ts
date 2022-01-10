import axios from 'axios';
import { toast } from 'react-toastify';
import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchDeviceState, IDeviceState, IProcessData } from './deviceState.model';

class DeviceStateService {
  ENDPOINT = '/device-states';

  public async searchDeviceState(
    searchParams?: ISearchDeviceState
  ): Promise<IApiResponse<ISearchResponse<IDeviceState>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getDeviceStateById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveDeviceState(data: IDeviceState): Promise<any> {
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

  public async deleteDeviceState(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const url = `${this.ENDPOINT}/process-data`;

    const cancelTokenSource = axios.CancelToken.source();

    return new Promise((resolve, reject) => {
      const timmer = setTimeout(() => {
        // Cancel request
        cancelTokenSource.cancel();
        toast.warning('Process is working in background.');
        resolve({status:200, body:{messages:['']}});
      }, 5 * 1000); // wait till 5 seconds

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
    // return request({ url, method: 'POST', data: data }).then((res) => {
    //   return res.data;
    // });
  }

  public async exportExcelFile(searchParams?: ISearchDeviceState): Promise<any> {
    const url = `device/search`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }
}
export default new DeviceStateService();
