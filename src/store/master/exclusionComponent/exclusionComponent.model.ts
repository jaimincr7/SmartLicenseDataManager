import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigExclusionComponent } from '../../../services/master/exclusionComponent/exclusionComponent.model';

export interface IConfigExclusionComponentState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionComponent[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionComponent;
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
