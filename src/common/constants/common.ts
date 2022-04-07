import { IDropDownOption } from './../models/common';
import { Messages } from './messages';

export const Common = {
  DATEFORMAT: 'YYYY-MM-DD',
  DATETIMEFORMAT: 'YYYY-MM-DD HH:mm:ss',
};

export const DEFAULT_PAGE_SIZE = 10;

export const booleanLookup: IDropDownOption[] = [
  { id: 0, name: 'No' },
  { id: 1, name: 'Yes' },
];

export const exportExcel = (fileName: string, url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
};

export const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
  types: {
    integer: Messages.INTEGER,
    number: Messages.NUMBER,
    email: Messages.INVALID,
  },
  pattern: {
    mismatch: Messages.INVALID,
  },
};

export const TableNames = {
  SqlServer: 'SQL Server',
  WindowsServer: 'Windows Server',
  Device: 'Device',
};

export const allDateColumns = [
  'date_added',
  'quote_begin_date',
  'quote_end_date',
  'coverage_expiration',
  'start_date',
  'end_date',
  'second_start_date',
  'second_end_date',
  'exchange_last_activity_date',
  'exchange_license_assign_date',
  'one_drive_last_activity_date',
  'one_drive_license_assign_date',
  'share_point_last_activity_date',
  'share_point_license_assign_date',
  'skype_for_business_last_activity_date',
  'skype_for_business_license_assign_date',
  'teams_last_activity_date',
  'teams_license_assign_date',
  'last_activated_date',
  'last_activation_date',
  'yammer_last_activity_date',
  'yammer_license_assign_date',
  'whenChanged',
  'when_created',
  'last_logon_date',
  'password_last_set',
  'when_created',
  'joined_date',
  'last_directory_update',
  'billing_period_start_date',
  'billing_period_end_date',
  'insert_date',
  'update_date',
  'date',
  'effective_date',
  'best_available_ship_date',
  'covered_line_start_date',
  'covered_line_end_date',
  'last_date_of_support',
  'report_refresh_date',
  'created_date',
  'deleted_date',
  'last_activity_date',
  'ship_date',
  'date_data_added',
  'last_update_date',
  'warranty_end_date',
  'l_do_sales',
  'l_do_support',
  'date_confirmed',
  'warranty_start',
  'warranty_end',
  'hw_l_do_s',
  'collection_date',
  'transaction_date',
  'purchase_date',
  'last_updated',
  'installed_date',
  'api_call_start',
  'api_call_end',
  'insert_data_start',
  'processed',
  'call_start',
  'call_end',
  'expiration_date',
  'start_time',
  'end_time',
  'run_date',
  'complete_date',
];
