import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchCiscoPolicy, ICiscoPolicy } from './ciscoPolicy.model';

class CiscoPolicyService {
  ENDPOINT = '/hw-cisco-policy';

  public async searchCiscoPolicy(
    searchParams?: ISearchCiscoPolicy
  ): Promise<IApiResponse<ISearchResponse<ICiscoPolicy>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getCiscoPolicyById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveCiscoPolicy(data: ICiscoPolicy): Promise<any> {
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

  public async deleteCiscoPolicy(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchCiscoPolicy): Promise<any> {
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
export default new CiscoPolicyService();
