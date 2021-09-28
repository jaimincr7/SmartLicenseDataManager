import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAgreementTypes {
  [x: string]: any;
  id?: number;
  agreement_type?: string;
  date_added?: string | Moment;
}

export interface ISearchAgreementTypes extends ISearch {
  is_lookup?: boolean;
}
