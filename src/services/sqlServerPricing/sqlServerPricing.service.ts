import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';
import { ISearchSqlServerPricing, ISqlServerPricing } from './sqlServerPricing.model';

class SqlServerPricingService {
  ENDPOINT = '/sql-server-pricing';

  public async searchSqlServerPricing(
    searchParams?: ISearchSqlServerPricing
  ): Promise<IApiResponse<ISearchResponse<ISqlServerPricing>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getLookupSqlServerPricingByFieldName(fieldName: string): Promise<any> {
    const url = `${this.ENDPOINT}/column-lookup/${fieldName}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getSqlServerPricingById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveSqlServerPricing(data: ISqlServerPricing): Promise<any> {
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

  public async deleteSqlServerPricing(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSqlServerPricing): Promise<any> {
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
export default new SqlServerPricingService();
