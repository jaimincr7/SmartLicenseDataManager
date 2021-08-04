import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365MailboxUsage } from '../../../services/o365/o365MailboxUsage/o365MailboxUsage.model';

export interface IO365MailboxUsageState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365MailboxUsage[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365MailboxUsage;
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
