import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddO365UsersProps } from './addO365Users.model';
import {
  o365UsersSelector,
  clearO365UsersGetById,
  clearO365UsersMessages,
} from '../../../../store/o365/o365Users/o365Users.reducer';
import { getO365UsersById, saveO365Users } from '../../../../store/o365/o365Users/o365Users.action';
import { IO365Users } from '../../../../services/o365/o365Users/o365Users.model';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddO365UsersModal: React.FC<IAddO365UsersProps> = (props) => {
  const o365Users = useAppSelector(o365UsersSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}
        <BreadCrumbs pageName={Page.O365Users} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365Users = {
    company_id: null,
    bu_id: null,
    tenant_id: null,
    alternate_email_addresses: null,
    block_credential: false,
    account_enabled: false,
    city: '',
    country: '',
    department: '',
    display_name: '',
    fax: '',
    first_name: '',
    last_dir_sync_time: '',
    last_name: '',
    last_password_change_timestamp: '',
    license_assignment_details: '',
    licenses: '',
    mobile_phone: '',
    oath_token_metadata: '',
    object_id: '',
    office: '',
    password_never_expires: '',
    phone_number: '',
    postal_code: '',
    preferred_data_location: '',
    preferred_language: '',
    proxy_addresses: '',
    release_track: '',
    soft_deletion_timestamp: '',
    state: '',
    street_address: '',
    strong_password_required: '',
    title: '',
    usage_location: '',
    user_principal_name: '',
    when_created: '',
    non_human: false,
    in_ad: false,
    active_in_ad: false,
    ad_exclusion: '',
    licensed: false,
    dir_sync_enabled: false,
    assigned_licenses: '',
    secondary_account: false,
    cost: null,
    m365_apps_assigned: false,
    project_assigned: false,
    visio_assigned: false,
    m365_apps_activations: null,
    project_activations: null,
    visio_activations: null,
    not_in_active_users_list: false,
    is_deleted: false,
    no_network_access: false,
    no_activity: false,
    network_access: null,
    exchange: null,
    one_drive: null,
    share_point: null,
    skype_for_business: null,
    teams: null,
    yammer: null,
    m365_apps: null,
    m365_apps_mac: false,
    m365_apps_windows: false,
    m365_apps_mobile: false,
    m365_apps_web: false,
    min_last_activity: null,
    no_activity_in_30_days: false,
    license_cost: '',
    m365_apps_outlook: false,
    m365_apps_word: false,
    m365_apps_excel: false,
    m365_apps_power_point: false,
    m365_apps_one_note: false,
    m365_apps_teams: false,
    assigned_plans: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IO365Users = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveO365Users(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        o365Users.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu_id: buId });
  };

  const fillValuesOnEdit = async (data: IO365Users) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        alternate_email_addresses: data.alternate_email_addresses,
        block_credential: data.block_credential,
        city: data.city,
        country: data.country,
        department: data.department,
        display_name: data.display_name,
        fax: data.fax,
        first_name: data.first_name,
        last_dir_sync_time: data.last_dir_sync_time,
        last_name: data.last_name,
        last_password_change_timestamp: data.last_password_change_timestamp,
        license_assignment_details: data.license_assignment_details,
        licenses: data.licenses,
        mobile_phone: data.mobile_phone,
        oath_token_metadata: data.oath_token_metadata,
        object_id: data.object_id,
        office: data.office,
        password_never_expires: data.password_never_expires,
        phone_number: data.phone_number,
        postal_code: data.postal_code,
        preferred_data_location: data.preferred_data_location,
        preferred_language: data.preferred_language,
        proxy_addresses: data.proxy_addresses,
        release_track: data.release_track,
        soft_deletion_timestamp: data.soft_deletion_timestamp,
        state: data.state,
        street_address: data.street_address,
        strong_password_required: data.strong_password_required,
        title: data.title,
        usage_location: data.usage_location,
        user_principal_name: data.user_principal_name,
        when_created: data.when_created,
        account_enabled: data.account_enabled,
        non_human: data.non_human,
        in_ad: data.in_ad,
        active_in_ad: data.active_in_ad,
        ad_exclusion: data.ad_exclusion,
        licensed: data.licensed,
        dir_sync_enabled: data.dir_sync_enabled,
        assigned_licenses: data.assigned_licenses,
        secondary_account: data.secondary_account,
        cost: data.cost,
        m365_apps_assigned: data.m365_apps_assigned,
        project_assigned: data.project_assigned,
        visio_assigned: data.visio_assigned,
        m365_apps_activations: data.m365_apps_activations,
        project_activations: data.project_activations,
        visio_activations: data.visio_activations,
        not_in_active_users_list: data.not_in_active_users_list,
        is_deleted: data.is_deleted,
        no_network_access: data.no_network_access,
        no_activity: data.no_activity,
        network_access: data.network_access,
        exchange: data.exchange,
        one_drive: data.one_drive,
        share_point: data.share_point,
        skype_for_business: data.skype_for_business,
        teams: data.teams,
        yammer: data.yammer,
        m365_apps: data.m365_apps,
        m365_apps_mac: data.m365_apps_mac,
        m365_apps_windows: data.m365_apps_windows,
        m365_apps_mobile: data.m365_apps_mobile,
        m365_apps_web: data.m365_apps_web,
        min_last_activity: data.min_last_activity,
        no_activity_in_30_days: data.no_activity_in_30_days,
        license_cost: data.license_cost,
        m365_apps_outlook: data.m365_apps_outlook,
        m365_apps_word: data.m365_apps_word,
        m365_apps_excel: data.m365_apps_excel,
        m365_apps_power_point: data.m365_apps_power_point,
        m365_apps_one_note: data.m365_apps_one_note,
        m365_apps_teams: data.m365_apps_teams,
        assigned_plans: data.assigned_plans,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365Users.save.messages.length > 0) {
      if (o365Users.save.hasErrors) {
        toast.error(o365Users.save.messages.join(' '));
      } else {
        toast.success(o365Users.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365UsersMessages());
    }
  }, [o365Users.save.messages]);

  useEffect(() => {
    if (commonLookups.save.messages.length > 0) {
      if (commonLookups.save.hasErrors) {
        toast.error(commonLookups.save.messages.join(' '));
      } else {
        toast.warn(commonLookups.save.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [commonLookups.save.messages]);

  useEffect(() => {
    if (+id > 0 && o365Users.getById.data) {
      const data = o365Users.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365Users.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getO365UsersById(+id));
    }
    return () => {
      dispatch(clearO365UsersGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id === 0 && !isMultiple) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      if (globalFilters.search.tenant_id && globalFilters.search.tenant_id !== 0) {
        if (!globalFilters.search.company_id) {
          dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        }
        if (!globalFilters.search.bu_id && globalFilters.search.company_id !== 0) {
          dispatch(getBULookup(globalSearch.company_id[0]));
        }
        const initlValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initlValues);
      }
    }
  }, []);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={title}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        {o365Users.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365Users.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365Users"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'tenant_id']} valuePropName="checked" noStyle>
                      <Checkbox>Tenant</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tenant'
                  )}
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      onChange={handleTenantChange}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.tenantLookup.loading}
                    >
                      {Object.keys(globalFilters?.globalTenantLookup?.data).length > 0
                        ? globalFilters?.globalTenantLookup?.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : commonLookups.tenantLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.companyLookup.loading}
                    >
                      {Object.keys(commonLookups.companyLookup.data).length > 0
                        ? commonLookups.companyLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalCompanyLookup?.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'bu_id']} valuePropName="checked" noStyle>
                      <Checkbox>BU</Checkbox>
                    </Form.Item>
                  ) : (
                    'BU'
                  )}
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select
                      onChange={handleBUChange}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.buLookup.loading}
                    >
                      {Object.keys(commonLookups.buLookup.data).length > 0
                        ? commonLookups.buLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalBULookup?.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'first_name']} valuePropName="checked" noStyle>
                      <Checkbox>First Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'First Name'
                  )}
                  <Form.Item
                    name="first_name"
                    className="m-0"
                    label="First Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_name']} valuePropName="checked" noStyle>
                      <Checkbox>Last Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Name'
                  )}
                  <Form.Item
                    name="last_name"
                    className="m-0"
                    label="Last Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'display_name']} valuePropName="checked" noStyle>
                      <Checkbox>Display Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Display Name'
                  )}
                  <Form.Item
                    name="display_name"
                    className="m-0"
                    label="Display Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'street_address']} valuePropName="checked" noStyle>
                      <Checkbox>Street Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'Street Address'
                  )}
                  <Form.Item
                    name="street_address"
                    className="m-0"
                    label="Street Address"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'city']} valuePropName="checked" noStyle>
                      <Checkbox>City</Checkbox>
                    </Form.Item>
                  ) : (
                    'City'
                  )}
                  <Form.Item name="city" className="m-0" label="City" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'state']} valuePropName="checked" noStyle>
                      <Checkbox>State</Checkbox>
                    </Form.Item>
                  ) : (
                    'State'
                  )}
                  <Form.Item name="state" className="m-0" label="State" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'country']} valuePropName="checked" noStyle>
                      <Checkbox>Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Country'
                  )}
                  <Form.Item name="country" className="m-0" label="Country" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'postal_code']} valuePropName="checked" noStyle>
                      <Checkbox>Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Postal Code'
                  )}
                  <Form.Item
                    name="postal_code"
                    className="m-0"
                    label="Postal Code"
                    rules={[{ pattern: /^[a-zA-Z0-9 \b]+$/, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'proxy_addresses']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Proxy Addresses</Checkbox>
                    </Form.Item>
                  ) : (
                    'Proxy Addresses'
                  )}
                  <Form.Item name="proxy_addresses" className="m-0" label="Proxy Addresses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'fax']} valuePropName="checked" noStyle>
                      <Checkbox>Fax</Checkbox>
                    </Form.Item>
                  ) : (
                    'Fax'
                  )}
                  <Form.Item
                    name="fax"
                    className="m-0"
                    label="Fax"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'mobile_phone']} valuePropName="checked" noStyle>
                      <Checkbox>Mobile Phone</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mobile Phone'
                  )}
                  <Form.Item
                    name="mobile_phone"
                    className="m-0"
                    label="Mobile Phone"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'phone_number']} valuePropName="checked" noStyle>
                      <Checkbox>Phone Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Phone Number'
                  )}
                  <Form.Item
                    name="phone_number"
                    className="m-0"
                    label="Phone Number"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'office']} valuePropName="checked" noStyle>
                      <Checkbox>Office</Checkbox>
                    </Form.Item>
                  ) : (
                    'Office'
                  )}
                  <Form.Item name="office" className="m-0" label="Office" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_added']} valuePropName="checked" noStyle>
                      <Checkbox>Date Added</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Added'
                  )}
                  <Form.Item name="date_added" label="Date Added" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'department']} valuePropName="checked" noStyle>
                      <Checkbox>Department</Checkbox>
                    </Form.Item>
                  ) : (
                    'Department'
                  )}
                  <Form.Item
                    name="department"
                    className="m-0"
                    label="Department"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'alternate_email_addresses']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Alternate Email Addresses</Checkbox>
                    </Form.Item>
                  ) : (
                    'Alternate Email Addresses'
                  )}
                  <Form.Item
                    name="alternate_email_addresses"
                    className="m-0"
                    label="Alternate Email Addresses"
                    rules={[{ type: 'email', max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_dir_sync_time']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Dir Sync Time</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Dir Sync Time'
                  )}
                  <Form.Item
                    name="last_dir_sync_time"
                    className="m-0"
                    label="Last Dir Sync Time"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_password_change_timestamp']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Password Change Timestamp</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Password Change Timestamp'
                  )}
                  <Form.Item
                    name="last_password_change_timestamp"
                    className="m-0"
                    label="Last Password Change Timestamp"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'license_assignment_details']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>License Assignment Details</Checkbox>
                    </Form.Item>
                  ) : (
                    'License Assignment Details'
                  )}
                  <Form.Item
                    name="license_assignment_details"
                    className="m-0"
                    label="License Assignment Details"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'licenses']} valuePropName="checked" noStyle>
                      <Checkbox>Licenses</Checkbox>
                    </Form.Item>
                  ) : (
                    'Licenses'
                  )}
                  <Form.Item name="licenses" className="m-0" label="Licenses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'oath_token_metadata']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Oath Token Metadata</Checkbox>
                    </Form.Item>
                  ) : (
                    'Oath Token Metadata'
                  )}
                  <Form.Item
                    name="oath_token_metadata"
                    className="m-0"
                    label="Oath Token Metadata"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'object_id']} valuePropName="checked" noStyle>
                      <Checkbox>Object Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Object Id'
                  )}
                  <Form.Item
                    name="object_id"
                    className="m-0"
                    label="Object Id"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'password_never_expires']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Password Never Expires</Checkbox>
                    </Form.Item>
                  ) : (
                    'Password Never Expires'
                  )}
                  <Form.Item
                    name="password_never_expires"
                    className="m-0"
                    label="Password Never Expires"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'preferred_data_location']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Preferred Data Location</Checkbox>
                    </Form.Item>
                  ) : (
                    'Preferred Data Location'
                  )}
                  <Form.Item
                    name="preferred_data_location"
                    className="m-0"
                    label="Preferred Data Location"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'preferred_language']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Preferred Language</Checkbox>
                    </Form.Item>
                  ) : (
                    'Preferred Language'
                  )}
                  <Form.Item
                    name="preferred_language"
                    className="m-0"
                    label="Preferred Language"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'release_track']} valuePropName="checked" noStyle>
                      <Checkbox>Release Track</Checkbox>
                    </Form.Item>
                  ) : (
                    'Release Track'
                  )}
                  <Form.Item
                    name="release_track"
                    className="m-0"
                    label="Release Track"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'soft_deletion_timestamp']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Soft Deletion Timestamp</Checkbox>
                    </Form.Item>
                  ) : (
                    'Soft Deletion Timestamp'
                  )}
                  <Form.Item
                    name="soft_deletion_timestamp"
                    className="m-0"
                    label="Soft Deletion Timestamp"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'strong_password_required']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Strong Password Required</Checkbox>
                    </Form.Item>
                  ) : (
                    'Strong Password Required'
                  )}
                  <Form.Item
                    name="strong_password_required"
                    className="m-0"
                    label="Strong Password Required"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'title']} valuePropName="checked" noStyle>
                      <Checkbox>Title</Checkbox>
                    </Form.Item>
                  ) : (
                    'Title'
                  )}
                  <Form.Item name="title" className="m-0" label="Title" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'usage_location']} valuePropName="checked" noStyle>
                      <Checkbox>Usage Location</Checkbox>
                    </Form.Item>
                  ) : (
                    'Usage Location'
                  )}
                  <Form.Item
                    name="usage_location"
                    className="m-0"
                    label="Usage Location"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'user_principal_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>User Principal Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'User Principal Name'
                  )}
                  <Form.Item
                    name="user_principal_name"
                    className="m-0"
                    label="User Principal Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'when_created']} valuePropName="checked" noStyle>
                      <Checkbox>When Created</Checkbox>
                    </Form.Item>
                  ) : (
                    'When Created'
                  )}
                  <Form.Item
                    name="when_created"
                    className="m-0"
                    label="When Created"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ad_exclusion']} valuePropName="checked" noStyle>
                      <Checkbox>AD Exclusion</Checkbox>
                    </Form.Item>
                  ) : (
                    'AD Exclusion'
                  )}
                  <Form.Item
                    name="ad_exclusion"
                    className="m-0"
                    label="AD Exclusion"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'assigned_licenses']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Assigned Licenses</Checkbox>
                    </Form.Item>
                  ) : (
                    'Assigned Licenses'
                  )}
                  <Form.Item name="assigned_licenses" className="m-0" label="Assigned Licenses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cost']} valuePropName="checked" noStyle>
                      <Checkbox>Cost</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost'
                  )}
                  <Form.Item name="cost" label="Cost" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_activations']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Assigned</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Assigned'
                  )}
                  <Form.Item
                    name="m365_apps_activations"
                    label="M365 Apps Assigned"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'project_activations']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Project Activations</Checkbox>
                    </Form.Item>
                  ) : (
                    'Project Activations'
                  )}
                  <Form.Item
                    name="project_activations"
                    label="Project Activations"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'visio_activations']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Visio Activations</Checkbox>
                    </Form.Item>
                  ) : (
                    'Visio Activations'
                  )}
                  <Form.Item
                    name="visio_activations"
                    label="Visio Activations"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'network_access']} valuePropName="checked" noStyle>
                      <Checkbox>Network Access</Checkbox>
                    </Form.Item>
                  ) : (
                    'Network Access'
                  )}
                  <Form.Item
                    name="network_access"
                    label="Network Access"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exchange']} valuePropName="checked" noStyle>
                      <Checkbox>Exchange</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange'
                  )}
                  <Form.Item
                    name="exchange"
                    label="Exchange"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'one_drive']} valuePropName="checked" noStyle>
                      <Checkbox>One Drive</Checkbox>
                    </Form.Item>
                  ) : (
                    'One Drive'
                  )}
                  <Form.Item
                    name="one_drive"
                    label="One Drive"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'share_point']} valuePropName="checked" noStyle>
                      <Checkbox>Share Point</Checkbox>
                    </Form.Item>
                  ) : (
                    'Share Point'
                  )}
                  <Form.Item
                    name="share_point"
                    label="Share Point"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'skype_for_business']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Skype For Business</Checkbox>
                    </Form.Item>
                  ) : (
                    'Skype For Business'
                  )}
                  <Form.Item
                    name="skype_for_business"
                    label="Skype For Business"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'teams']} valuePropName="checked" noStyle>
                      <Checkbox>Teams</Checkbox>
                    </Form.Item>
                  ) : (
                    'Teams'
                  )}
                  <Form.Item
                    name="teams"
                    label="Teams"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'yammer']} valuePropName="checked" noStyle>
                      <Checkbox>Yammer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Yammer'
                  )}
                  <Form.Item
                    name="yammer"
                    label="Yammer"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'm365_apps']} valuePropName="checked" noStyle>
                      <Checkbox>M365 Apps</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps'
                  )}
                  <Form.Item
                    name="m365_apps"
                    label="M365 Apps"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'min_last_activity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Min Last Activity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Min Last Activity'
                  )}
                  <Form.Item
                    name="min_last_activity"
                    label="Min Last Activity"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'license_cost']} valuePropName="checked" noStyle>
                      <Checkbox>License Cost</Checkbox>
                    </Form.Item>
                  ) : (
                    'License Cost'
                  )}
                  <Form.Item name="license_cost" className="m-0" label="License Cost">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'assigned_plans']} valuePropName="checked" noStyle>
                      <Checkbox>Assigned Plans</Checkbox>
                    </Form.Item>
                  ) : (
                    'Assigned Plans'
                  )}
                  <Form.Item name="assigned_plans" className="m-0" label="Assigned Plans">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="block_credential" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'block_credential']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Block Credentials</Checkbox>
                    </Form.Item>
                  ) : (
                    'Block Credentials'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="non_human" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'non_human']} valuePropName="checked" noStyle>
                      <Checkbox>Non Human</Checkbox>
                    </Form.Item>
                  ) : (
                    'Non Human'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="account_enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'account_enabled']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Accont Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Accont Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="in_ad" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'in_ad']} valuePropName="checked" noStyle>
                      <Checkbox>In Ad</Checkbox>
                    </Form.Item>
                  ) : (
                    'In Ad'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="active_in_ad" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'active_in_ad']} valuePropName="checked" noStyle>
                      <Checkbox>Active in Ad</Checkbox>
                    </Form.Item>
                  ) : (
                    'Active in Ad'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="licensed" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'licensed']} valuePropName="checked" noStyle>
                      <Checkbox>Licensed</Checkbox>
                    </Form.Item>
                  ) : (
                    'Licensed'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dir_sync_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'dir_sync_enabled']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Dir Sync Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Dir Sync Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="secondary_account" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'secondary_account']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Secondary Account</Checkbox>
                    </Form.Item>
                  ) : (
                    'Secondary Account'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_assigned']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Assigned</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Assigned'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="project_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'project_assigned']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Project Assigned</Checkbox>
                    </Form.Item>
                  ) : (
                    'Project Assigned'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="visio_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'visio_assigned']} valuePropName="checked" noStyle>
                      <Checkbox>Visio Assigned</Checkbox>
                    </Form.Item>
                  ) : (
                    'Visio Assigned'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="not_in_active_users_list"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'not_in_active_users_list']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Not In Active Users List</Checkbox>
                    </Form.Item>
                  ) : (
                    'Not In Active Users List'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_deleted" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_deleted']} valuePropName="checked" noStyle>
                      <Checkbox>Is Deleted</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Deleted'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_network_access" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'no_network_access']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>No Network Access</Checkbox>
                    </Form.Item>
                  ) : (
                    'No Network Access'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_activity" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'no_activity']} valuePropName="checked" noStyle>
                      <Checkbox>No Activity</Checkbox>
                    </Form.Item>
                  ) : (
                    'No Activity'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_activity_in_30_days" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'no_activity_in_30_days']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>No Activity In 30 Days</Checkbox>
                    </Form.Item>
                  ) : (
                    'No Activity In 30 Days'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'm365_apps_mac']} valuePropName="checked" noStyle>
                      <Checkbox>M365 Apps Mac</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Mac'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_windows" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Windows'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_mobile" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Mobile'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'm365_apps_web']} valuePropName="checked" noStyle>
                      <Checkbox>M365 Apps Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Web'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_outlook" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_outlook']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Outlook</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Outlook'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_word" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'm365_apps_word']} valuePropName="checked" noStyle>
                      <Checkbox>M365 Apps Word</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Word'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_excel" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_excel']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Excel</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Excel'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_power_point" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_power_point']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Power Point</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Power Point'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_one_note" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_one_note']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps One Note</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps One Note'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_teams" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'm365_apps_teams']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>M365 Apps Teams</Checkbox>
                    </Form.Item>
                  ) : (
                    'M365 Apps Teams'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365Users.save.loading || commonLookups.save.loading}
              >
                {submitButtonText}
              </Button>
              <Button key="back" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default AddO365UsersModal;
