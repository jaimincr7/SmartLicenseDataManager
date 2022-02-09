import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ICronViewLog, ISearchCronViewLog } from './cronViewLog.model';

class CronViewLogService {
  ENDPOINT = '/sps-scheduler-log';

  public async searchCronViewLog(
    searchParams?: ISearchCronViewLog
  ): Promise<IApiResponse<ISearchResponse<ICronViewLog>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }
}
export default new CronViewLogService();
