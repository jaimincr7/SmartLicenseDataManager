import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IProcessData,
  ISearchSqlServerExclusions,
  ISqlServerExclusions,
} from './sqlServerExclusions.model';

class SqlServerExclusionsService {
  ENDPOINT = '/sql-server-exclusions';

  public async searchSqlServerExclusions(
    searchParams?: ISearchSqlServerExclusions
  ): Promise<IApiResponse<ISearchResponse<ISqlServerExclusions>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSqlServerExclusionsById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getFieldLookups(): Promise<any> {
    const url = `${this.ENDPOINT}/field-lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSqlServerExclusions(data: ISqlServerExclusions): Promise<any> {
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

  public async deleteSqlServerExclusions(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSqlServerExclusions): Promise<any> {
    const url = `back-ground-processes/export-excel`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const inputValues = {
      ...data,
      debug: false,
    };
    const url = `back-ground-processes/sql-server-exclusions-process-data`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }
}
export default new SqlServerExclusionsService();
