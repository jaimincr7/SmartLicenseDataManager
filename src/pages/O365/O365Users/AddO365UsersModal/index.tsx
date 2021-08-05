import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
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

const { Option } = Select;

const AddO365UsersModal: React.FC<IAddO365UsersProps> = (props) => {
  const o365Users = useAppSelector(o365UsersSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
    alternate_email_addresses: '',
    block_credential: false,
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
  };

  const onFinish = (values: any) => {
    const inputValues: IO365Users = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365Users(inputValues));
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
    if (+id > 0 && o365Users.getById.data) {
      const data = o365Users.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365Users.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365UsersById(+id));
    }
    return () => {
      dispatch(clearO365UsersGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
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
                      {commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                  <label className="label">Company</label>
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
                      {commonLookups.companyLookup.data.map((option: ILookup) => (
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
                  <label className="label">BU</label>
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
                      {commonLookups.buLookup.data.map((option: ILookup) => (
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
                  <label className="label">First Name</label>
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
                  <label className="label">Last Name</label>
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
                  <label className="label">Display Name</label>
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
                  <label className="label">Street Address</label>
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
                  <label className="label">City</label>
                  <Form.Item name="city" className="m-0" label="City" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">State</label>
                  <Form.Item name="state" className="m-0" label="State" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Country</label>
                  <Form.Item name="country" className="m-0" label="Country" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Postal Code</label>
                  <Form.Item
                    name="postal_code"
                    className="m-0"
                    label="Postal Code"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Proxy Addresses</label>
                  <Form.Item name="proxy_addresses" className="m-0" label="Proxy Addresses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Fax</label>
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
                  <label className="label">Mobile Phone</label>
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
                  <label className="label">Phone Number</label>
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
                  <label className="label">Office</label>
                  <Form.Item name="office" className="m-0" label="Office" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Department</label>
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
                  <label className="label">Alternate Email Addresses</label>
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
                  <label className="label">Last Dir Sync Time</label>
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
                  <label className="label">Last Password Change Timestamp</label>
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
                  <label className="label">License Assignment Details</label>
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
                  <label className="label">Licenses</label>
                  <Form.Item name="licenses" className="m-0" label="Licenses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Oath Token Metadata</label>
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
                  <label className="label">ObjectId</label>
                  <Form.Item
                    name="object_id"
                    className="m-0"
                    label="ObjectId"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Password Never Expires</label>
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
                  <label className="label">Preferred Data Location</label>
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
                  <label className="label">Preferred Language</label>
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
                  <label className="label">Release Track</label>
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
                  <label className="label">Soft Deletion Timestamp</label>
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
                  <label className="label">Strong Password Required</label>
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
                  <label className="label">Title</label>
                  <Form.Item name="title" className="m-0" label="Title" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Usage Location</label>
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
                  <label className="label">User Principal Name</label>
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
                  <label className="label">When Created</label>
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
                  <label className="label">AD Exclusion</label>
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
                  <label className="label">Assigned Licenses</label>
                  <Form.Item name="assigned_licenses" className="m-0" label="Assigned Licenses">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cost</label>
                  <Form.Item name="cost" label="Cost" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">M365 Apps Assigned</label>
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
                  <label className="label">Project Activations</label>
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
                  <label className="label">Visio Activations</label>
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
                  <label className="label">Network Access</label>
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
                  <label className="label">Exchange</label>
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
                  <label className="label">OneDrive</label>
                  <Form.Item
                    name="one_drive"
                    label="OneDrive"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SharePoint</label>
                  <Form.Item
                    name="share_point"
                    label="SharePoint"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Skype For Business</label>
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
                  <label className="label">Teams</label>
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
                  <label className="label">Yammer</label>
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
                  <label className="label">M365 Apps</label>
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
                  <label className="label">Min Last Activity</label>
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
                  <label className="label">License Cost</label>
                  <Form.Item name="license_cost" className="m-0" label="License Cost">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Assigned Plans</label>
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
                  <label className="label">Block Credential</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="non_human" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">NonHuman</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="in_ad" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">In AD</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="active_in_ad" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Active in AD</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="licensed" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Licensed</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dir_sync_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Dir Sync Enabled</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="secondary_account" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Secondary Account</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Assigned</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="project_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Project Assigned</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="visio_assigned" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Visio Assigned</label>
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
                  <label className="label">Not in Active Users List</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_deleted" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Deleted</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_network_access" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">No Network Access</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_activity" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">No Activity</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="no_activity_in_30_days" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">No Activity in 30 Days</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Mac</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_windows" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Windows</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_mobile" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Mobile</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Web</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_outlook" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Outlook</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_word" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Word</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_excel" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Excel</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_power_point" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps PowerPoint</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_one_note" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps OneNote</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="m365_apps_teams" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">M365 Apps Teams</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365Users.save.loading}
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
