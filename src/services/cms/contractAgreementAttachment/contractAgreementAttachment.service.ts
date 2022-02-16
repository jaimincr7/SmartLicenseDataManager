import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchCmsContractAgreementAttachment,
  ICmsContractAgreementAttachment,
} from './contractAgreementAttachment.model';

class CmsContractAgreementAttachmentService {
  ENDPOINT = '/cms-contract-agreement-attachment';

  public async searchCmsContractAgreementAttachment(
    searchParams?: ISearchCmsContractAgreementAttachment
  ): Promise<IApiResponse<ISearchResponse<ICmsContractAgreementAttachment>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getCmsContractAgreementAttachmentById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveCmsContractAgreementAttachment(
    data: ICmsContractAgreementAttachment
  ): Promise<any> {
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

  public async deleteCmsContractAgreementAttachment(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchCmsContractAgreementAttachment): Promise<any> {
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
export default new CmsContractAgreementAttachmentService();
