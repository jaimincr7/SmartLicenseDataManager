import request from '../../utils/request';

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
}
export default new UserService();
