import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IAPIColMapping,
  ISaveApiColumnMapping,
  ISearchAPIColMapping,
  ISearchAPIColumn,
} from './apiColMapping.model';

class ApiColMappingService {
  ENDPOINT = '/config-sps-api-column-mapping';

  public async searchApiColMapping(
    searchParams?: ISearchAPIColMapping
  ): Promise<IApiResponse<ISearchResponse<IAPIColMapping>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getApiColMappingById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveApiColMapping(data: ISaveApiColumnMapping): Promise<any> {
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

  public async deleteApiColMapping(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchAPIColMapping): Promise<any> {
    const url = `back-ground-processes/export-excel`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }

  public async apiColLookups(): Promise<any> {
    const url = `sps-config-api/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getApiColumn(searchData: ISearchAPIColumn): Promise<any> {
    const url = `sps-api/api-column`;
    return request({ url, method: 'POST', data: searchData }).then((res) => {
      return res.data;
    });
  }
}
export default new ApiColMappingService();
