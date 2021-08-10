import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import {
  IConfiguration,
  IWorkspace,
  IPowerBIReport,
} from '../../../services/powerBiReports/configuration/configuration.model';

export interface IConfigurationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfiguration[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfiguration;
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
  getGroups: {
    loading: boolean;
    hasErrors: boolean;
    data: IWorkspace[];
  };
  getReportsByGroupId: {
    loading: boolean;
    hasErrors: boolean;
    data: IPowerBIReport[];
  };
}
