import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IO365Reservations } from '../../../services/o365/o365Reservations/o365Reservations.model';

export interface IO365ReservationsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Reservations[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IO365Reservations;
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
