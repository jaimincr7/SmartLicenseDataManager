import { IApiResponse } from '../../common/models/common';
import request from '../../utils/request';
import {
  IDataTable,
  IDataTableForImport,
  IImportDataTable,
  ISaveExcelMapping,
} from './bulkImport.model';

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

  public async getExcelFileMapping(data: any): Promise<any> {
    const url = `/config-excel-file-mapping/mapping`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getExcelFileMappingLookup(data: any): Promise<any> {
    const url = `/config-excel-file-mapping/lookup`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async deleteFileMapping(id: number): Promise<any> {
    const url = `/config-excel-file-mapping/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async deleteColumnMapping(id: number): Promise<any> {
    const url = `/config-excel-column-mapping/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async saveExcelFileMapping(data: ISaveExcelMapping): Promise<any> {
    const url = `/config-excel-file-mapping`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }
}
export default new BulkImportService();
