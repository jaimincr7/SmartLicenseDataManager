import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISpsApiJobs } from '../../../services/sps/spsApiJobs/spsApiJobs.model';

export interface ISpsApiJobsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiJobs[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISpsApiJobs;
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
  reRunAllScenarios: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
