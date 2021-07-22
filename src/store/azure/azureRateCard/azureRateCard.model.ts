import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAzureRateCard } from '../../../services/azure/azureRateCard/azureRateCard.model';

export interface IAzureRateCardState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureRateCard[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAzureRateCard;
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
