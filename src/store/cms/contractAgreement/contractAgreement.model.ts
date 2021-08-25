import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsContractAgreement } from '../../../services/cms/contractAgreement/contractAgreement.model';

export interface ICmsContractAgreementState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContractAgreement[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContractAgreement;
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
