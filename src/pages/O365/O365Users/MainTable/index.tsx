import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearO365UsersMessages,
  o365UsersSelector,
} from '../../../../store/o365/o365Users/o365Users.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365Users,
  searchO365Users,
} from '../../../../store/o365/o365Users/o365Users.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import o365UsersService from '../../../../services/o365/o365Users/o365Users.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const o365Users = useAppSelector(o365UsersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365UsersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365Users.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365Users.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', o365Users.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', o365Users.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'First Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('first_name', form),
            dataIndex: 'first_name',
            key: 'first_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Last Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_name', form),
            dataIndex: 'last_name',
            key: 'last_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Display Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('display_name', form),
            dataIndex: 'display_name',
            key: 'display_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Street Address',
        sorter: true,
        children: [
          {
            title: FilterBySwap('street_address', form),
            dataIndex: 'street_address',
            key: 'street_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'City',
        sorter: true,
        children: [
          {
            title: FilterBySwap('city', form),
            dataIndex: 'city',
            key: 'city',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'State',
        sorter: true,
        children: [
          {
            title: FilterBySwap('state', form),
            dataIndex: 'state',
            key: 'state',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Country',
        sorter: true,
        children: [
          {
            title: FilterBySwap('country', form),
            dataIndex: 'country',
            key: 'country',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Postal Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('postal_code', form),
            dataIndex: 'postal_code',
            key: 'postal_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Office',
        sorter: true,
        children: [
          {
            title: FilterBySwap('office', form),
            dataIndex: 'office',
            key: 'office',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Department',
        sorter: true,
        children: [
          {
            title: FilterBySwap('department', form),
            dataIndex: 'department',
            key: 'department',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Fax',
        sorter: true,
        children: [
          {
            title: FilterBySwap('fax', form),
            dataIndex: 'fax',
            key: 'fax',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Mobile Phone',
        sorter: true,
        children: [
          {
            title: FilterBySwap('mobile_phone', form),
            dataIndex: 'mobile_phone',
            key: 'mobile_phone',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Phone Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('phone_number', form),
            dataIndex: 'phone_number',
            key: 'phone_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Alternate Email Addresses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('alternate_email_addresses', form),
            dataIndex: 'alternate_email_addresses',
            key: 'alternate_email_addresses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Proxy Addresses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('proxy_addresses', form),
            dataIndex: 'proxy_addresses',
            key: 'proxy_addresses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Last Dir Sync Time',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_dir_sync_time', form),
            dataIndex: 'last_dir_sync_time',
            key: 'last_dir_sync_time',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Last Password Change Timestamp',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_password_change_timestamp', form),
            dataIndex: 'last_password_change_timestamp',
            key: 'last_password_change_timestamp',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Assignment Details',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_assignment_details', form),
            dataIndex: 'license_assignment_details',
            key: 'license_assignment_details',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('licenses', form),
            dataIndex: 'licenses',
            key: 'licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Oath Token Metadata',
        sorter: true,
        children: [
          {
            title: FilterBySwap('oath_token_metadata', form),
            dataIndex: 'oath_token_metadata',
            key: 'oath_token_metadata',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'ObjectId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('object_id', form),
            dataIndex: 'object_id',
            key: 'object_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Password Never Expires',
        sorter: true,
        children: [
          {
            title: FilterBySwap('password_never_expires', form),
            dataIndex: 'password_never_expires',
            key: 'password_never_expires',
            ellipsis: true,
          },
        ],
      },

      {
        title: 'Preferred Data Location',
        sorter: true,
        children: [
          {
            title: FilterBySwap('preferred_data_location', form),
            dataIndex: 'preferred_data_location',
            key: 'preferred_data_location',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Preferred Language',
        sorter: true,
        children: [
          {
            title: FilterBySwap('preferred_language', form),
            dataIndex: 'preferred_language',
            key: 'preferred_language',
            ellipsis: true,
          },
        ],
      },

      {
        title: 'Release Track',
        sorter: true,
        children: [
          {
            title: FilterBySwap('release_track', form),
            dataIndex: 'release_track',
            key: 'release_track',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Soft Deletion Timestamp',
        sorter: true,
        children: [
          {
            title: FilterBySwap('soft_deletion_timestamp', form),
            dataIndex: 'soft_deletion_timestamp',
            key: 'soft_deletion_timestamp',
            ellipsis: true,
          },
        ],
      },

      {
        title: 'Strong Password Required',
        sorter: true,
        children: [
          {
            title: FilterBySwap('strong_password_required', form),
            dataIndex: 'strong_password_required',
            key: 'strong_password_required',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Title',
        sorter: true,
        children: [
          {
            title: FilterBySwap('title', form),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Usage Location',
        sorter: true,
        children: [
          {
            title: FilterBySwap('usage_location', form),
            dataIndex: 'usage_location',
            key: 'usage_location',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'User Principal Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('user_principal_name', form),
            dataIndex: 'user_principal_name',
            key: 'user_principal_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'When Created',
        sorter: true,
        children: [
          {
            title: FilterBySwap('when_created', form),
            dataIndex: 'when_created',
            key: 'when_created',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'NonHuman',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('non_human', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'non_human',
            key: 'non_human',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'In AD',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('in_ad', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'in_ad',
            key: 'in_ad',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Active in AD',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('active_in_ad', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'active_in_ad',
            key: 'active_in_ad',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'AD Exclusion',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ad_exclusion', form),
            dataIndex: 'ad_exclusion',
            key: 'ad_exclusion',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licensed',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('licensed', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'licensed',
            key: 'licensed',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Dir Sync Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('dir_sync_enabled', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'dir_sync_enabled',
            key: 'dir_sync_enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Assigned Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('assigned_licenses', form),
            dataIndex: 'assigned_licenses',
            key: 'assigned_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Secondary Account',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('secondary_account', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'secondary_account',
            key: 'secondary_account',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Cost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cost', form),
            dataIndex: 'cost',
            key: 'cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'M365 Apps Assigned',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_assigned', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_assigned',
            key: 'm365_apps_assigned',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Project Assigned',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('project_assigned', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'project_assigned',
            key: 'project_assigned',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Visio Assigned',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('visio_assigned', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'visio_assigned',
            key: 'visio_assigned',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Activations',
        sorter: true,
        children: [
          {
            title: FilterBySwap('m365_apps_activations', form),
            dataIndex: 'm365_apps_activations',
            key: 'm365_apps_activations',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Project Activations',
        sorter: true,
        children: [
          {
            title: FilterBySwap('project_activations', form),
            dataIndex: 'project_activations',
            key: 'project_activations',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Visio Activations',
        sorter: true,
        children: [
          {
            title: FilterBySwap('visio_activations', form),
            dataIndex: 'visio_activations',
            key: 'visio_activations',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Not in Active Users List',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'not_in_active_users_list',
              o365Users.search.lookups?.booleanLookup
            ),
            dataIndex: 'not_in_active_users_list',
            key: 'not_in_active_users_list',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Is Deleted',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('is_deleted', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'No Network Access',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('no_network_access', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'no_network_access',
            key: 'no_network_access',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'No Activity',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('no_activity', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'no_activity',
            key: 'no_activity',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'No Activity in 30 Days',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'no_activity_in_30_days',
              o365Users.search.lookups?.booleanLookup
            ),
            dataIndex: 'no_activity_in_30_days',
            key: 'no_activity_in_30_days',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Network Access',
        sorter: true,
        children: [
          {
            title: FilterBySwap('network_access', form),
            dataIndex: 'network_access',
            key: 'network_access',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Exchange',
        sorter: true,
        children: [
          {
            title: FilterBySwap('exchange', form),
            dataIndex: 'exchange',
            key: 'exchange',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'OneDrive',
        sorter: true,
        children: [
          {
            title: FilterBySwap('one_drive', form),
            dataIndex: 'one_drive',
            key: 'one_drive',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SharePoint',
        sorter: true,
        children: [
          {
            title: FilterBySwap('share_point', form),
            dataIndex: 'share_point',
            key: 'share_point',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Skype for Business',
        sorter: true,
        children: [
          {
            title: FilterBySwap('skype_for_business', form),
            dataIndex: 'skype_for_business',
            key: 'skype_for_business',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Teams',
        sorter: true,
        children: [
          {
            title: FilterBySwap('teams', form),
            dataIndex: 'teams',
            key: 'teams',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Yammer',
        sorter: true,
        children: [
          {
            title: FilterBySwap('yammer', form),
            dataIndex: 'yammer',
            key: 'yammer',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'M365 Apps',
        sorter: true,
        children: [
          {
            title: FilterBySwap('m365_apps', form),
            dataIndex: 'm365_apps',
            key: 'm365_apps',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Min Last Activity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('min_last_activity', form),
            dataIndex: 'min_last_activity',
            key: 'min_last_activity',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Cost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_cost', form),
            dataIndex: 'license_cost',
            key: 'license_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Assigned Plans',
        sorter: true,
        children: [
          {
            title: FilterBySwap('assigned_plans', form),
            dataIndex: 'assigned_plans',
            key: 'assigned_plans',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Block Credential',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('block_credential', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'block_credential',
            key: 'block_credential',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Mac',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_mac', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_mac',
            key: 'm365_apps_mac',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Windows',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_windows', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_windows',
            key: 'm365_apps_windows',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Mobile',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_mobile', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_mobile',
            key: 'm365_apps_mobile',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Web',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_web', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_web',
            key: 'm365_apps_web',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Outlook',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_outlook', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_outlook',
            key: 'm365_apps_outlook',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Word',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_word', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_word',
            key: 'm365_apps_word',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Excel',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_excel', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_excel',
            key: 'm365_apps_excel',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps PowerPoint',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'm365_apps_power_point',
              o365Users.search.lookups?.booleanLookup
            ),
            dataIndex: 'm365_apps_power_point',
            key: 'm365_apps_power_point',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps OneNote',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_one_note', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_one_note',
            key: 'm365_apps_one_note',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'M365 Apps Teams',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('m365_apps_teams', o365Users.search.lookups?.booleanLookup),
            dataIndex: 'm365_apps_teams',
            key: 'm365_apps_teams',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeO365Users = (id: number) => {
    dispatch(deleteO365Users(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365Users}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-users/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365Users}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365Users(data.id)}>
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.O365Users)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365UsersSelector}
        searchTableData={searchO365Users}
        clearTableDataMessages={clearO365UsersMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
