import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface ICmsContractAgreementAttachment {
  id?: number;
  contract_agreement_id: number;
  original_name: string;
  file_path: string;
  file_name: string;
  user_id: number;
  date_added?: string | Moment;
}

export interface ISearchCmsContractAgreementAttachment extends ISearch {
  is_lookup?: boolean;
}
