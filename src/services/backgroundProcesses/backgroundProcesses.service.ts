import { IApiResponse, ISearchResponse } from '../../common/models/common';
import request from '../../utils/request';
import { ISearchBackgroundProcesses, IBackgroundProcesses } from './backgroundProcesses.model';

class backgroundProcessesService {
  ENDPOINT = '/back-ground-processes';

  public async searchBackgroundProcesses(
    searchParams?: ISearchBackgroundProcesses
  ): Promise<IApiResponse<ISearchResponse<IBackgroundProcesses>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getBackgroundProcessesById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async deleteBackgroundProcesses(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }
}
export default new backgroundProcessesService();
