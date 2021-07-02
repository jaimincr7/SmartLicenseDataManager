import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';
import {
  IDeleteDataset,
  ISearchSqlServer,
  ISqlServer,
  IBulkInsertDataset,
  IProcessData,
} from './sqlServer.model';

class SqlServerService {
  ENDPOINT = '/sql-server';

  public async searchSqlServer(
    searchParams?: ISearchSqlServer
  ): Promise<IApiResponse<ISearchResponse<ISqlServer>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSqlServerById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSqlServer(data: ISqlServer): Promise<any> {
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

  public async deleteSqlServer(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async deleteDataset(data: IDeleteDataset): Promise<any> {
    const inputValues = {
      ...data,
      table_name: '[sql server]',
      debug: false,
    };
    const url = `${this.ENDPOINT}/delete-dataset`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const url = `${this.ENDPOINT}/process-data`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSqlServer): Promise<any> {
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
    const url = `${this.ENDPOINT}/columns-for-import-data`;
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
export default new SqlServerService();
