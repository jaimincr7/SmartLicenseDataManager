import { IApiResponse } from '../../common/models/common';
import request from '../../utils/request';
import { IDataTable, IDataTableForImport, IImportDataTable } from './bulkImport.model';

class BulkImportService {
  ENDPOINT = '/config-import-data-tables';

  public async getTablesForImport(): Promise<IApiResponse<Array<IDataTableForImport>>> {
    const url = `${this.ENDPOINT}/table-for-import`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getTables(): Promise<IApiResponse<Array<IDataTable>>> {
    const url = `${this.ENDPOINT}/tables`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveTableForImport(data: IImportDataTable): Promise<any> {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }
}
export default new BulkImportService();
