import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IReRunAllScenarios,
  ISearchWindowsServerLicense,
  IWindowsServerLicense,
} from './windowsServerLicense.model';

class WindowsServerLicenseService {
  ENDPOINT = '/windows-server-license';

  public async searchWindowsServerLicense(
    searchParams?: ISearchWindowsServerLicense
  ): Promise<IApiResponse<ISearchResponse<IWindowsServerLicense>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getWindowsServerLicenseById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveWindowsServerLicense(data: IWindowsServerLicense): Promise<any> {
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

  public async deleteWindowsServerLicense(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchWindowsServerLicense): Promise<any> {
    const url = `back-ground-processes/export-excel`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }

  public async reRunAllScenarios(data: IReRunAllScenarios): Promise<any> {
    const dataInput = { ...data, debug: false };
    const url = `${this.ENDPOINT}/run-all-license-scenario`;
    return request({ url, method: 'POST', data: dataInput }).then((res) => {
      return res.data;
    });
  }
}
export default new WindowsServerLicenseService();
