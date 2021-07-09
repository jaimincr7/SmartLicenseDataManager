import { IDropDownOption } from '../../../common/models/common';
import { IWindowsServerLicense } from '../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';

export interface IWindowsServerLicenseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerLicense[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IWindowsServerLicense;
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
