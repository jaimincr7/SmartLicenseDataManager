import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICiscoSpectrum } from '../../../services/hwCisco/ciscoSpectrum/ciscoSpectrum.model';

export interface ICiscoSpectrumState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSpectrum[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICiscoSpectrum;
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
