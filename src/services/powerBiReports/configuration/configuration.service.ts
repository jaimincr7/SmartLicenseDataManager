import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { IConfiguration, IReportEmbedUrl, ISearchConfiguration } from './configuration.model';

class ConfigurationService {
  ENDPOINT = '/power-bi-report-config';

  public async searchConfiguration(
    searchParams?: ISearchConfiguration
  ): Promise<IApiResponse<ISearchResponse<IConfiguration>>> {
    delete searchParams.is_lookup;
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getReportEmbedUrl(
    searchParams?: IReportEmbedUrl
  ): Promise<IApiResponse<ISearchResponse<IConfiguration>>> {
    const url = `${this.ENDPOINT}/embedded-url`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getGroups(): Promise<any> {
    const url = `${this.ENDPOINT}/groups`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getReportsByGroupId(groupId: string): Promise<any> {
    const url = `${this.ENDPOINT}/reports-by-group/${groupId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getConfigurationById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getReportDetail(name: string): Promise<any> {
    const url = `${this.ENDPOINT}/access-token/${name}`;
    return request({ url, method: 'POST' }).then((res) => {
      return res.data;
    });
  }

  public async saveConfiguration(data: IConfiguration): Promise<any> {
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

  public async deleteConfiguration(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchConfiguration): Promise<any> {
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
export default new ConfigurationService();
