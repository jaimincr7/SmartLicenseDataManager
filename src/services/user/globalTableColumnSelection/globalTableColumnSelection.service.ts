import { IApiResponse, ITableColumnSelection } from '../../../common/models/common';
import request from '../../../utils/request';

class GlobalTableColumnSelectionService {
  ENDPOINT = '/global-table-column-selection';

  public async getGlobalTableColumns(tableName: string): Promise<IApiResponse<any>> {
    const url = `${this.ENDPOINT}/${tableName}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveGlobalTableColumnSelection(data: ITableColumnSelection): Promise<any> {
    const inputValues = {
      ...data,
      columns: JSON.stringify(data.columns),
    };
    const url = `${this.ENDPOINT}`;
    return request({ url, method: 'POST', data: inputValues }).then((res) => {
      return res.data;
    });
  }
}
export default new GlobalTableColumnSelectionService();
