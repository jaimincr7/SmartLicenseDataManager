import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchWindowsServerLicenseDetail,
  IWindowsServerLicenseDetail,
} from './windowsServerLicenseDetail.model';

class WindowsServerLicenseDetailService {
  ENDPOINT = '/windows-server-license-detail';

  public async searchWindowsServerLicenseDetail(
    searchParams?: ISearchWindowsServerLicenseDetail
  ): Promise<IApiResponse<ISearchResponse<IWindowsServerLicenseDetail>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getLicenseDetailColumnLookup(
    licenseId: number,
    columnName: string
  ): Promise<IApiResponse<any>> {
    const url = `${this.ENDPOINT}/column-lookup/${columnName}/${licenseId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchWindowsServerLicenseDetail): Promise<any> {
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
export default new WindowsServerLicenseDetailService();
