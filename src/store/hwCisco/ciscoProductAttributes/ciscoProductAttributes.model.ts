import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoProductAttributes } from '../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.model';

export interface ICiscoProductAttributesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoProductAttributes[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoProductAttributes;
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
