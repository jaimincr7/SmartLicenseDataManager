import { IAdUser, IBulkInsertDataset, ISearchAdUsers } from './adUsers.model';
import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';

class AdUsersService {
  ENDPOINT = '/ad-users';

  public async searchAdUsers(
    searchParams?: ISearchAdUsers
  ): Promise<IApiResponse<ISearchResponse<IAdUser>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getLookupAdUsersByFieldName(fieldName: string): Promise<any> {
    const url = `${this.ENDPOINT}/column-lookup/${fieldName}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAdUserById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveAdUser(data: IAdUser): Promise<any> {
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

  public async deleteAdUser(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchAdUsers): Promise<any> {
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
      table_name: 'AdUsers',
    };
    const url = `${this.ENDPOINT}/bulk-insert`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }
}
export default new AdUsersService();
