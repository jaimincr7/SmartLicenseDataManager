import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigFileType } from '../../../services/master/fileTypes/fileTypes.model';

export interface IConfigFileTypeState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigFileType[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigFileType;
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
