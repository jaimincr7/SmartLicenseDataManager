import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigComponentTableColumn } from '../../../services/master/componentTableColumn/componentTableColumn.model';

export interface IConfigComponentTableColumnState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigComponentTableColumn[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigComponentTableColumn;
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
