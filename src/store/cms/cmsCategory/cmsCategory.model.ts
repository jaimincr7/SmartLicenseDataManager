import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsCategory } from '../../../services/cms/cmsCategory/cmsCategory.model';

export interface ICmsCategoryState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsCategory[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsCategory;
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
