import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { IAdUsersExclusions, ISearchAdUsersExclusions } from './adUsersExclusions.model';

class AdUsersExclusionsService {
  ENDPOINT = '/ad-users-exclusions';

  public async searchAdUsersExclusions(
    searchParams?: ISearchAdUsersExclusions
  ): Promise<IApiResponse<ISearchResponse<IAdUsersExclusions>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getAdUsersExclusionById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAdUsersExclusionFieldLookup(): Promise<any> {
    const url = `${this.ENDPOINT}/field-lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveAdUsersExclusion(data: IAdUsersExclusions): Promise<any> {
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

  public async deleteAdUsersExclusion(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchAdUsersExclusions): Promise<any> {
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
export default new AdUsersExclusionsService();
