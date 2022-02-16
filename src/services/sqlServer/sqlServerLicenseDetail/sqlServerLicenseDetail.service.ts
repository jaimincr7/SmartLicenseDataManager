import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchSqlServerLicenseDetail,
  ISqlServerLicenseDetail,
} from './sqlServerLicenseDetail.model';

class SqlServerLicenseDetailService {
  ENDPOINT = '/sql-server-license-detail';

  public async searchSqlServerLicenseDetail(
    searchParams?: ISearchSqlServerLicenseDetail
  ): Promise<IApiResponse<ISearchResponse<ISqlServerLicenseDetail>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getLicenseDetailColumnLookup(
    licenseId: number,
    data: {}
  ): Promise<IApiResponse<any>> {
    const url = `${this.ENDPOINT}/column-lookup/${licenseId}`;
    return request({ url, method: 'POST', data }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchSqlServerLicenseDetail): Promise<any> {
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
export default new SqlServerLicenseDetailService();
