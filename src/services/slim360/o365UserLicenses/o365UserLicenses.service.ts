import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchSlim360O365UserLicenses, ISlim360O365UserLicenses } from './o365UserLicenses.model';

class Slim360O365UserLicensesService {
  ENDPOINT = '/slim360-o365-user-licenses';

  public async searchSlim360O365UserLicenses(
    searchParams?: ISearchSlim360O365UserLicenses
  ): Promise<IApiResponse<ISearchResponse<ISlim360O365UserLicenses>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getSlim360O365UserLicensesById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSlim360O365UserLicenses(data: ISlim360O365UserLicenses): Promise<any> {
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

  public async deleteSlim360O365UserLicenses(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSlim360O365UserLicenses): Promise<any> {
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
export default new Slim360O365UserLicensesService();
