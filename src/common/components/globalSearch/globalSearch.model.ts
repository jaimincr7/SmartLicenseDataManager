import { Moment } from 'moment';

export interface IGlobalSearchProps {
  isDateAdded?: boolean;
}

export interface IGlobalSearchInitialValues {
  tenant_id: number;
  company_id: number;
  bu_id: number;
  date_added: Moment | string;
}
