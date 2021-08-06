import { IApiResponse } from '../../common/models/common';
import request from '../../utils/request';
import { ILookup } from '../common/common.model';

class UserService {
  ENDPOINT = '/user';
  userEncData: Promise<any>;

  public async getUserEncData(): Promise<any> {
    const url = `${this.ENDPOINT}/user-enc/vishal.patel@metrixdata360.com`;
    if (!this.userEncData) {
      this.userEncData = request({
        url,
        method: 'GET',
        headers: { 'X-Skip-UserEncData': true },
      }).then((res) => {
        return res.data.body.data;
      });
    }
    return this.userEncData;
  }

  public async getRoleLookup(): Promise<IApiResponse<ILookup>> {
    const url = `/role/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }
}
export default new UserService();
