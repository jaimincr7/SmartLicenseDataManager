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
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
  forEditModal,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { IAdDevices } from '../../../../services/ad/adDevices/adDevices.model';
import { ILookup } from '../../../../services/common/common.model';
import { getAdDeviceById, saveAdDevice } from '../../../../store/ad/adDevices/adDevices.action';
import {
  adDevicesSelector,
  clearAdDeviceGetById,
  clearAdDeviceMessages,
} from '../../../../store/ad/adDevices/adDevices.reducer';
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
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IAddAdDeviceProps } from './addAdDevice.model';

const { Option } = Select;

const AddAdDeviceModal: React.FC<IAddAdDeviceProps> = (props) => {
  const adDevices = useAppSelector(adDevicesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ADDevices} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAdDevices = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    source: '',
    distinguished_name: '',
    dns_host_name: '',
    enabled: false,
    iPv4_address: '',
    last_logon: '',
    last_logon_date: null,
    last_logon_timestamp: '',
    name: '',
    object_class: '',
    object_guid: '',
    operating_system: '',
    password_expired: false,
    password_last_set: null,
    password_never_expires: false,
    sam_account_name: '',
    sid: '',
    user_principal_name: '',
    when_created: null,
    device_type: '',
    exclusion: '',
    exclusion_id: null,
    inventoried: false,
    active: false,
    qualified: false,
    domain: '',
    description: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IAdDevices = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.last_logon_date = passDateToApi(inputValues.last_logon_date, true);
    inputValues.password_last_set = passDateToApi(inputValues.password_last_set, true);
    inputValues.when_created = passDateToApi(inputValues.when_created, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveAdDevice(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        adDevices.search.tableName
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

  const fillValuesOnEdit = async (data) => {
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
        device_type: data.device_type,
        source: data.source,
        operating_system: data.operating_system,
        distinguished_name: data.distinguished_name,
        dns_host_name: data.dns_host_name,
        enabled: data.enabled,
        iPv4_address: data.iPv4_address,
        last_logon: data.last_logon,
        last_logon_date: _.isNull(data.last_logon_date) ? null : forEditModal(data.last_logon_date),
        last_logon_timestamp: data.last_logon_timestamp,
        name: data.name,
        object_class: data.object_class,
        object_guid: data.object_guid,
        password_expired: data.password_expired,
        password_last_set: _.isNull(data.password_last_set)
          ? null
          : forEditModal(data.password_last_set),
        password_never_expires: data.password_never_expires,
        sam_account_name: data.sam_account_name,
        sid: data.sid,
        user_principal_name: data.user_principal_name,
        when_created: _.isNull(data.when_created) ? null : forEditModal(data.when_created),
        exclusion: data.exclusion,
        exclusion_id: data.exclusion_id,
        inventoried: data.inventoried,
        active: data.active,
        qualified: data.qualified,
        domain: data.domain,
        description: data.description,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (adDevices.save.messages.length > 0) {
      if (adDevices.save.hasErrors) {
        toast.error(adDevices.save.messages.join(' '));
      } else {
        toast.success(adDevices.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAdDeviceMessages());
    }
  }, [adDevices.save.messages]);

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
    if (+id > 0 && adDevices.getById.data) {
      const data = adDevices.getById.data;
      fillValuesOnEdit(data);
    }
  }, [adDevices.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getAdDeviceById(+id));
    }
    return () => {
      dispatch(clearAdDeviceGetById());
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
        {adDevices.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={adDevices.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAdDevice"
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
                      loading={commonLookups.tenantLookup.loading}
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
                      loading={commonLookups.buLookup.loading}
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
                    <Form.Item
                      name={['checked', 'distinguished_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Distinguished Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Distinguished Name'
                  )}
                  <Form.Item
                    name="distinguished_name"
                    label="Distinguished Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'dns_host_name']} valuePropName="checked" noStyle>
                      <Checkbox>DNS Host Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'DNS Host Name'
                  )}
                  <Form.Item
                    name="dns_host_name"
                    className="m-0"
                    label="DNS Host Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'iPv4_address']} valuePropName="checked" noStyle>
                      <Checkbox>iPv4 Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'iPv4 Address'
                  )}
                  <Form.Item
                    name="iPv4_address"
                    label="iPv4 Address"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'device_type']} valuePropName="checked" noStyle>
                      <Checkbox>Device type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device type'
                  )}
                  <Form.Item
                    name="device_type"
                    label="Device type"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_logon']} valuePropName="checked" noStyle>
                      <Checkbox>Last Logon</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Logon'
                  )}
                  <Form.Item
                    name="last_logon"
                    label="Last Logon"
                    className="m-0"
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
                      name={['checked', 'last_logon_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Logon Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Logon Date'
                  )}
                  <Form.Item name="last_logon_date" label="Last Logon Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_logon_timestamp']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Logon Timestamp</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Logon Timestamp'
                  )}
                  <Form.Item
                    name="last_logon_timestamp"
                    label="Last Logon Timestamp"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'object_class']} valuePropName="checked" noStyle>
                      <Checkbox>Object Class</Checkbox>
                    </Form.Item>
                  ) : (
                    'Object Class'
                  )}
                  <Form.Item
                    name="object_class"
                    label="Object Class"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'object_guid']} valuePropName="checked" noStyle>
                      <Checkbox>Object GUId</Checkbox>
                    </Form.Item>
                  ) : (
                    'Object GUId'
                  )}
                  <Form.Item
                    name="object_guid"
                    label="Object GUId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'source']} valuePropName="checked" noStyle>
                      <Checkbox>Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Source'
                  )}
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'operating_system']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Operating system</Checkbox>
                    </Form.Item>
                  ) : (
                    'Operating system'
                  )}
                  <Form.Item
                    name="operating_system"
                    label="Operating system"
                    className="m-0"
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
                      name={['checked', 'password_last_set']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Password Last Set</Checkbox>
                    </Form.Item>
                  ) : (
                    'Password Last Set'
                  )}
                  <Form.Item name="password_last_set" label="Password Last Set" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'sam_account_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Sam Account Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Sam Account Name'
                  )}
                  <Form.Item
                    name="sam_account_name"
                    label="Sam Account Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sid']} valuePropName="checked" noStyle>
                      <Checkbox>sId</Checkbox>
                    </Form.Item>
                  ) : (
                    'sId'
                  )}
                  <Form.Item name="sid" label="sId" className="m-0" rules={[{ max: 510 }]}>
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
                    label="User Principal Name"
                    className="m-0"
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
                  <Form.Item name="when_created" label="When Created" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exclusion']} valuePropName="checked" noStyle>
                      <Checkbox>Exclusion</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclusion'
                  )}
                  <Form.Item
                    name="exclusion"
                    label="Exclusion"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exclusion_id']} valuePropName="checked" noStyle>
                      <Checkbox>Exclusion Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclusion Id'
                  )}
                  <Form.Item
                    name="exclusion_id"
                    label="Exclusion Id"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={1} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'domain']} valuePropName="checked" noStyle>
                      <Checkbox>Domain</Checkbox>
                    </Form.Item>
                  ) : (
                    'Domain'
                  )}
                  <Form.Item name="domain" label="Domain" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="password_expired" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'password_expired']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Password Expired</Checkbox>
                    </Form.Item>
                  ) : (
                    'Password Expired'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="password_never_expires" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
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
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="inventoried" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'inventoried']} valuePropName="checked" noStyle>
                      <Checkbox>Inventoried</Checkbox>
                    </Form.Item>
                  ) : (
                    'Inventoried'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="active" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'active']} valuePropName="checked" noStyle>
                      <Checkbox>Active</Checkbox>
                    </Form.Item>
                  ) : (
                    'Active'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="qualified" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'qualified']} valuePropName="checked" noStyle>
                      <Checkbox>Qualified</Checkbox>
                    </Form.Item>
                  ) : (
                    'Qualified'
                  )}
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'description']} valuePropName="checked" noStyle>
                      <Checkbox>Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Description'
                  )}
                  <Form.Item name="description" label="Description" className="m-0">
                    <Input.TextArea className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={adDevices.save.loading || commonLookups.save.loading}
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
export default AddAdDeviceModal;
