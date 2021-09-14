import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigFileCategories } from '../../../services/master/fileCategories/fileCategories.model';

export interface IConfigFileCategoriesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigFileCategories[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigFileCategories;
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
