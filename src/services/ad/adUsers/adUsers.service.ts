import { IAdUser, IProcessData, ISearchAdUsers } from './adUsers.model';
import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';

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

  public async getAdUserById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const inputValues = {
      ...data,
      debug: false,
    };
    const url = `back-ground-processes/ad-users-process-data`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
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
export default new AdUsersService();
