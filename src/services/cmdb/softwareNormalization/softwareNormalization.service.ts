import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchCmdbSoftwareNormalization,
  ICmdbSoftwareNormalization,
} from './softwareNormalization.model';

class CmdbSoftwareNormalizationService {
  ENDPOINT = '/cmdb-software-normalization';

  public async searchCmdbSoftwareNormalization(
    searchParams?: ISearchCmdbSoftwareNormalization
  ): Promise<IApiResponse<ISearchResponse<ICmdbSoftwareNormalization>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getCmdbSoftwareNormalizationById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveCmdbSoftwareNormalization(data: ICmdbSoftwareNormalization): Promise<any> {
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

  public async deleteCmdbSoftwareNormalization(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchCmdbSoftwareNormalization): Promise<any> {
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
export default new CmdbSoftwareNormalizationService();
