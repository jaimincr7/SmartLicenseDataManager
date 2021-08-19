import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsContact } from '../../../services/cms/contact/contact.model';

export interface ICmsContactState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContact[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContact;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
