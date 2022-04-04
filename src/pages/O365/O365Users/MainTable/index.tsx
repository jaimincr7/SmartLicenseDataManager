import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import o365UsersService from '../../../../services/o365/o365Users/o365Users.service';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
    setFilterKeys,
  } = props;
  const o365Users = useAppSelector(o365UsersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return o365UsersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365Users.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">ID</span>,
        column: 'id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('id', form),
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              o365Users.search.lookups?.tenants?.length > 0
                ? o365Users.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              o365Users.search.lookups?.companies?.length > 0
                ? o365Users.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              o365Users.search.lookups?.bus?.length > 0
                ? o365Users.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', o365Users.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">First Name</span>,
        column: 'FirstName',
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
        title: <span className="dragHandler">Last Name</span>,
        column: 'LastName',
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
        title: <span className="dragHandler">Display Name</span>,
        column: 'DisplayName',
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
        title: <span className="dragHandler">Street Address</span>,
        column: 'StreetAddress',
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
        title: <span className="dragHandler">City</span>,
        column: 'City',
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
        title: <span className="dragHandler">State</span>,
        column: 'State',
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
        title: <span className="dragHandler">Country</span>,
        column: 'Country',
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
        title: <span className="dragHandler">Postal Code</span>,
        column: 'PostalCode',
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
        title: <span className="dragHandler">Office</span>,
        column: 'Office',
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
        title: <span className="dragHandler">Department</span>,
        column: 'Department',
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
        title: <span className="dragHandler">Fax</span>,
        column: 'Fax',
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
        title: <span className="dragHandler">Mobile Phone</span>,
        column: 'MobilePhone',
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
        title: <span className="dragHandler">Phone Number</span>,
        column: 'PhoneNumber',
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
        title: <span className="dragHandler">Alternate Email Addresses</span>,
        column: 'AlternateEmailAddresses',
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
        title: <span className="dragHandler">Proxy Addresses</span>,
        column: 'ProxyAddresses',
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
        title: <span className="dragHandler">Last Dir Sync Time</span>,
        column: 'LastDirSyncTime',
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
        title: <span className="dragHandler">Last Password Change Timestamp</span>,
        column: 'LastPasswordChangeTimestamp',
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
        title: <span className="dragHandler">License Assignment Details</span>,
        column: 'LicenseAssignmentDetails',
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
        title: <span className="dragHandler">Licenses</span>,
        column: 'Licenses',
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
        title: <span className="dragHandler">Oath Token Metadata</span>,
        column: 'OathTokenMetadata',
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
        title: <span className="dragHandler">Object Id</span>,
        column: 'ObjectId',
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
        title: <span className="dragHandler">Password Never Expires</span>,
        column: 'PasswordNeverExpires',
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
        title: <span className="dragHandler">Preferred Data Location</span>,
        column: 'PreferredDataLocation',
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
        title: <span className="dragHandler">Preferred Language</span>,
        column: 'PreferredLanguage',
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
        title: <span className="dragHandler">Release Track</span>,
        column: 'ReleaseTrack',
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
        title: <span className="dragHandler">Soft Deletion Timestamp</span>,
        column: 'SoftDeletionTimestamp',
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
        title: <span className="dragHandler">Strong Password Required</span>,
        column: 'StrongPasswordRequired',
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
        title: <span className="dragHandler">Title</span>,
        column: 'Title',
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
        title: <span className="dragHandler">Usage Location</span>,
        column: 'UsageLocation',
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
        title: <span className="dragHandler">User Principal Name</span>,
        column: 'UserPrincipalName',
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
        title: <span className="dragHandler">When Created</span>,
        column: 'WhenCreated',
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
        title: <span className="dragHandler">Account Enabled</span>,
        column: 'accountEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'account_enabled',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'account_enabled',
            key: 'account_enabled',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Non Human</span>,
        column: 'NonHuman',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'non_human',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'non_human',
            key: 'non_human',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">In AD</span>,
        column: 'In AD',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'in_ad',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'in_ad',
            key: 'in_ad',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Active in AD</span>,
        column: 'Active in AD',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'active_in_ad',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'active_in_ad',
            key: 'active_in_ad',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">AD Exclusion</span>,
        column: 'AD Exclusion',
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
        title: <span className="dragHandler">Licensed</span>,
        column: 'Licensed',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'licensed',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'licensed',
            key: 'licensed',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Dir Sync Enabled</span>,
        column: 'DirSyncEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'dir_sync_enabled',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'dir_sync_enabled',
            key: 'dir_sync_enabled',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Assigned Licenses</span>,
        column: 'assignedLicenses',
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
        title: <span className="dragHandler">Secondary Account</span>,
        column: 'SecondaryAccount',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'secondary_account',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'secondary_account',
            key: 'secondary_account',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cost</span>,
        column: 'Cost',
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
        title: <span className="dragHandler">M365 Apps Assigned</span>,
        column: 'M365 Apps Assigned',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_assigned',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_assigned',
            key: 'm365_apps_assigned',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Project Assigned</span>,
        column: 'Project Assigned',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'project_assigned',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'project_assigned',
            key: 'project_assigned',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Visio Assigned</span>,
        column: 'Visio Assigned',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'visio_assigned',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'visio_assigned',
            key: 'visio_assigned',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Activations</span>,
        column: 'M365 Apps Activations',
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
        title: <span className="dragHandler">Project Activations</span>,
        column: 'Project Activations',
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
        title: <span className="dragHandler">Visio Activations</span>,
        column: 'Visio Activations',
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
        title: <span className="dragHandler">Not in Active Users List</span>,
        column: 'Not in Active Users List',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'not_in_active_users_list',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'not_in_active_users_list',
            key: 'not_in_active_users_list',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Deleted</span>,
        column: 'Is Deleted',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_deleted',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">No Network Access</span>,
        column: 'No Network Access',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'no_network_access',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'no_network_access',
            key: 'no_network_access',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">No Activity</span>,
        column: 'No Activity',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'no_activity',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'no_activity',
            key: 'no_activity',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">No Activity in 30 Days</span>,
        column: 'No Activity in 30 Days',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'no_activity_in_30_days',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'no_activity_in_30_days',
            key: 'no_activity_in_30_days',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Network Access</span>,
        column: 'Network Access',
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
        title: <span className="dragHandler">Exchange</span>,
        column: 'Exchange',
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
        title: <span className="dragHandler">One Drive</span>,
        column: 'OneDrive',
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
        title: <span className="dragHandler">Share Point</span>,
        column: 'SharePoint',
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
        title: <span className="dragHandler">Skype for Business</span>,
        column: 'Skype For Business',
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
        title: <span className="dragHandler">Teams</span>,
        column: 'Teams',
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
        title: <span className="dragHandler">Yammer</span>,
        column: 'Yammer',
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
        title: <span className="dragHandler">M365 Apps</span>,
        column: 'M365 Apps',
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
        title: <span className="dragHandler">Min Last Activity</span>,
        column: 'Min Last Activity',
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
        title: <span className="dragHandler">License Cost</span>,
        column: 'License - Cost',
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
        title: <span className="dragHandler">Assigned Plans</span>,
        column: 'assignedPlans',
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
        title: <span className="dragHandler">Block Credential</span>,
        column: 'BlockCredential',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'block_credential',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'block_credential',
            key: 'block_credential',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Mac</span>,
        column: 'M365 Apps Mac',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_mac',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_mac',
            key: 'm365_apps_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Windows</span>,
        column: 'M365 Apps Windows',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_windows',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_windows',
            key: 'm365_apps_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Mobile</span>,
        column: 'M365 Apps Mobile',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_mobile',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_mobile',
            key: 'm365_apps_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Web</span>,
        column: 'M365 Apps Web',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_web',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_web',
            key: 'm365_apps_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Outlook</span>,
        column: 'M365 Apps Outlook',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_outlook',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_outlook',
            key: 'm365_apps_outlook',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Word</span>,
        column: 'M365 Apps Word',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_word',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_word',
            key: 'm365_apps_word',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Excel</span>,
        column: 'M365 Apps Excel',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_excel',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_excel',
            key: 'm365_apps_excel',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps PowerPoint</span>,
        column: 'M365 Apps PowerPoint',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_power_point',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_power_point',
            key: 'm365_apps_power_point',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps OneNote</span>,
        column: 'M365 Apps OneNote',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_one_note',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_one_note',
            key: 'm365_apps_one_note',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">M365 Apps Teams</span>,
        column: 'M365 Apps Teams',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'm365_apps_teams',
              o365Users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'm365_apps_teams',
            key: 'm365_apps_teams',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeO365Users(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365Users)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
