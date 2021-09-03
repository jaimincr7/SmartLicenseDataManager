import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigComponent } from '../../../services/master/component/component.model';

export interface IConfigComponentState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigComponent[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigComponent;
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
