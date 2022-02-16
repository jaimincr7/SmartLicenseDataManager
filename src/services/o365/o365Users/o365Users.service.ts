import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchO365Users, IO365Users, IProcessData } from './o365Users.model';

class O365UsersService {
  ENDPOINT = '/o365-users';

  public async searchO365Users(
    searchParams?: ISearchO365Users
  ): Promise<IApiResponse<ISearchResponse<IO365Users>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getO365UsersById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveO365Users(data: IO365Users): Promise<any> {
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

  public async deleteO365Users(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async processData(data: IProcessData): Promise<any> {
    const inputValues = {
      ...data,
    };
    const url = `back-ground-processes/o365-users-process-data`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchO365Users): Promise<any> {
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
export default new O365UsersService();
