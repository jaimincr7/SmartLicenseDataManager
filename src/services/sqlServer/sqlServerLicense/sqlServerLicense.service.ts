import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IReRunAllScenarios,
  ISearchSqlServerLicense,
  ISqlServerLicense,
} from './sqlServerLicense.model';

class SqlServerLicenseService {
  ENDPOINT = '/sql-server-license';

  public async searchSqlServerLicense(
    searchParams?: ISearchSqlServerLicense
  ): Promise<IApiResponse<ISearchResponse<ISqlServerLicense>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSqlServerLicenseById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSqlServerLicense(data: ISqlServerLicense): Promise<any> {
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

  public async deleteSqlServerLicense(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSqlServerLicense): Promise<any> {
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
export default new SqlServerLicenseService();
