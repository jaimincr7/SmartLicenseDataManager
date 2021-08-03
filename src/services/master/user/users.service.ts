import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchUser, IUser } from './users.model';

class UserService {
  ENDPOINT = '/user';

  public async searchUser(
    searchParams?: ISearchUser
  ): Promise<IApiResponse<ISearchResponse<IUser>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getUserById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getUserRole(): Promise<any> {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveUser(data: IUser): Promise<any> {
    (data.password_hash =
      'mhold2B1lL/Xl10+KmyIBXF0/rV05dsqRAINQ/h0MMbxWG0pqHpdRe8T5rcMP4sVlgs9MCtA6Z/UaAP5R0PLwA'),
      (data.password_salt = 'Mth5['),
      (data.insert_user_id = 5);
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

  public async deleteUser(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchUser): Promise<any> {
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
}
export default new UserService();
