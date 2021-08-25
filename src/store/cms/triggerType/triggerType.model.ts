import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsTriggerType } from '../../../services/cms/triggerType/triggerType.model';

export interface ICmsTriggerTypeState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsTriggerType[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsTriggerType;
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
