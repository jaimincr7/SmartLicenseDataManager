import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsContractAgreementAttachment } from '../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.model';

export interface ICmsContractAgreementAttachmentState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContractAgreementAttachment[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsContractAgreementAttachment;
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
