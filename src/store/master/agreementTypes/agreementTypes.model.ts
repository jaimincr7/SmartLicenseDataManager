import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAgreementTypes } from '../../../services/master/agreementTypes/agreementTypes.model';

export interface IAgreementTypesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAgreementTypes[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAgreementTypes;
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
