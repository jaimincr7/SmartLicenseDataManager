import { IDeleteDataset } from '../../../services/master/deleteDataset/deleteDataset.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface IDeleteDatasetState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IDeleteDataset[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IDeleteDataset;
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
