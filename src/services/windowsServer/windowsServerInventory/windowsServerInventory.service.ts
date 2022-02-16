import {
  IProcessData,
  ISearchWindowsServerInventory,
  IWindowsServerInventory,
} from './windowsServerInventory.model';
import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';

class WindowsServerInventoryService {
  ENDPOINT = '/windows-server-inventory';

  public async searchWindowsServerInventory(
    searchParams?: ISearchWindowsServerInventory
  ): Promise<IApiResponse<ISearchResponse<IWindowsServerInventory>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getWindowsServerInventoryById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveWindowsServerInventory(data: IWindowsServerInventory): Promise<any> {
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

  public async deleteWindowsServerInventory(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const url = `back-ground-processes/windows-server-inventory-process-data`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchWindowsServerInventory): Promise<any> {
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
export default new WindowsServerInventoryService();
