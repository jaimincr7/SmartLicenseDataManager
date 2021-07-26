import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ITabVCluster } from '../../../services/rvTools/tabVCluster/tabVCluster.model';

export interface ITabVClusterState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVCluster[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVCluster;
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
