import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoSiteMatrix } from '../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.model';

export interface ICiscoSiteMatrixState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSiteMatrix[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSiteMatrix;
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
