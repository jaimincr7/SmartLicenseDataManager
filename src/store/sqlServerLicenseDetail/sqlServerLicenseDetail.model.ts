import { ISqlServerLicenseDetail } from './../../services/sqlServerLicenseDetail/sqlServerLicenseDetail.model';
import { IDropDownOption } from '../../common/models/common';

export interface ISqlServerLicenseDetailState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISqlServerLicenseDetail[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
}
