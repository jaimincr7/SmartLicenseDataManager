import { ISpsApiJobsData } from '../../../services/sps/spsApiJobsData/spsApiJobsData.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ISpsApiJobsDataState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiJobsData[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  runJobData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  tableColumnSelection?: ITableColumnSelection;
}
