import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbProcessor } from '../../../services/cmdb/processor/processor.model';

export interface ICmdbProcessorState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbProcessor[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbProcessor;
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
