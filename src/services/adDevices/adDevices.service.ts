import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';
import {
  IDeleteDataset,
  ISearchAdDevices,
  IAdDevices,
  IBulkInsertDataset,
  IProcessData,
} from './adDevices.model';

class AdDevicesService {
  ENDPOINT = '/ad-devices';

  public async searchAdDevices(
    searchParams?: ISearchAdDevices
  ): Promise<IApiResponse<ISearchResponse<IAdDevices>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getLookupAdDevicesByFieldName(fieldName: string): Promise<any> {
    const url = `${this.ENDPOINT}/column-lookup/${fieldName}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAdDeviceById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveAdDevice(data: IAdDevices): Promise<any> {
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

  public async deleteAdDevice(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async deleteDataset(data: IDeleteDataset): Promise<any> {
    const inputValues = {
      ...data,
      table_name: '[ad devices]',
      debug: false,
    };
    const url = `${this.ENDPOINT}/delete-dataset`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const inputValues = {
      ...data,
      debug: false,
    };
    const url = `${this.ENDPOINT}/process-data`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchAdDevices): Promise<any> {
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

  public async getExcelColumns(data: any): Promise<any> {
    const headers = {
      Accept: 'multipart/form-data',
    };
    const url = `${this.ENDPOINT}/getExcelColumns`;
    return request({ url, method: 'POST', data: data, headers: headers }).then((res) => {
      return res.data;
    });
  }

  public async bulkInsert(data: IBulkInsertDataset): Promise<any> {
    const inputValues = {
      ...data,
      table_name: 'sql server',
    };
    const url = `${this.ENDPOINT}/bulk-insert`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }
}
export default new AdDevicesService();
