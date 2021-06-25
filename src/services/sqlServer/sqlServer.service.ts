import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';
import { IDeleteDataset, ISearchSqlServer, ISqlServer } from './sqlServer.model';

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

  public async getLookupSqlServerByFieldName(fieldName: string): Promise<any> {
    const url = `${this.ENDPOINT}/column-lookup/${fieldName}`;
    return request({ url, method: 'GET' }).then((res) => {
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
}
export default new SqlServerService();
