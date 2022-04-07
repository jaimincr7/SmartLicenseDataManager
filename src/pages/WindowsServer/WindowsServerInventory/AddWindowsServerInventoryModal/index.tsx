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
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { IWindowsServerInventory } from '../../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';
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
import {
  getWindowsServerInventoryById,
  saveWindowsServerInventory,
} from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.action';
import {
  clearWindowsServerInventoryGetById,
  clearWindowsServerInventoryMessages,
  windowsServerInventorySelector,
} from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import { IAddWindowsServerInventoryProps } from './addWindowsServerInventory.model';

const { Option } = Select;

const AddWindowsServerInventoryModal: React.FC<IAddWindowsServerInventoryProps> = (props) => {
  const inventory = useAppSelector(windowsServerInventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.WindowsServerInventory} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IWindowsServerInventory = {
    company_id: null,
    bu_id: null,
    host: null,
    procs: null,
    cores: null,
    device_name: null,
    device_type: null,
    product_family: null,
    version: null,
    edition: null,
    vCPU: null,
    ha_enabled: false,
    device_state: null,
    software_state: null,
    cluster: null,
    source: null,
    operating_system: null,
    tenant_id: null,
    fqdn: null,
    cost_code: null,
    line_of_business: null,
    application: null,
    data_center: null,
    serial_number: null,
    drs_enabled: false,
    exempt: false,
    sc_exempt: false,
    azure_hosted: false,
    sc_server: false,
    sc_agent: false,
    sc_version: null,
    market: null,
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IWindowsServerInventory = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveWindowsServerInventory(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        inventory.search.tableName
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

  const fillValuesOnEdit = async (data: IWindowsServerInventory) => {
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
        cluster: data.cluster,
        cost_code: data.cost_code,
        data_center: data.data_center,
        device_name: data.device_name,
        host: data.host,
        device_type: data.device_type,
        product_family: data.product_family,
        version: data.version,
        edition: data.edition,
        device_state: data.device_state,
        software_state: data.software_state,
        source: data.source,
        operating_system: data.operating_system,
        fqdn: data.fqdn,
        line_of_business: data.line_of_business,
        market: data.market,
        application: data.application,
        serial_number: data.serial_number,
        cores: data.cores,
        procs: data.procs,
        vCPU: data.vCPU,
        ha_enabled: data.ha_enabled,
        azure_hosted: data.azure_hosted,
        drs_enabled: data.drs_enabled,
        exempt: data.exempt,
        sc_exempt: data.exempt,
        sc_server: data.sc_server,
        sc_agent: data.sc_agent,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        sc_version: data.sc_version,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (inventory.save.messages.length > 0) {
      if (inventory.save.hasErrors) {
        toast.error(inventory.save.messages.join(' '));
      } else {
        toast.success(inventory.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearWindowsServerInventoryMessages());
    }
  }, [inventory.save.messages]);

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
    if (+id > 0 && inventory.getById.data) {
      const data = inventory.getById.data;
      fillValuesOnEdit(data);
    }
  }, [inventory.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getWindowsServerInventoryById(+id));
    }
    return () => {
      dispatch(clearWindowsServerInventoryGetById());
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
        {inventory.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={inventory.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addWindowsServerInventory"
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
                    <Form.Item name={['checked', 'host']} valuePropName="checked" noStyle>
                      <Checkbox>Host</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host'
                  )}
                  <Form.Item name="host" className="m-0" label="Host" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'procs']} valuePropName="checked" noStyle>
                      <Checkbox>Procs</Checkbox>
                    </Form.Item>
                  ) : (
                    'Procs'
                  )}
                  <Form.Item
                    name="procs"
                    label="Procs"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cores']} valuePropName="checked" noStyle>
                      <Checkbox>Cores</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cores'
                  )}
                  <Form.Item
                    name="cores"
                    label="Cores"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'device_name']} valuePropName="checked" noStyle>
                      <Checkbox>Device Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Name'
                  )}
                  <Form.Item
                    name="device_name"
                    label="Device Name"
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
                      <Checkbox>Device Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Type'
                  )}
                  <Form.Item
                    name="device_type"
                    label="Device Type"
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
                    <Form.Item name={['checked', 'product_family']} valuePropName="checked" noStyle>
                      <Checkbox>Product Family</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Family'
                  )}
                  <Form.Item
                    name="product_family"
                    label="Product Family"
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
                    <Form.Item name={['checked', 'version']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item name="version" label="Version" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'edition']} valuePropName="checked" noStyle>
                      <Checkbox>Edition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition'
                  )}
                  <Form.Item name="edition" label="Edition" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vCPU']} valuePropName="checked" noStyle>
                      <Checkbox>vCPU</Checkbox>
                    </Form.Item>
                  ) : (
                    'vCPU'
                  )}
                  <Form.Item name="vCPU" label="vCPU" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'device_state']} valuePropName="checked" noStyle>
                      <Checkbox>Device State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device State'
                  )}
                  <Form.Item
                    name="device_state"
                    label="Device State"
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
                    <Form.Item name={['checked', 'software_state']} valuePropName="checked" noStyle>
                      <Checkbox>Software State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software State'
                  )}
                  <Form.Item
                    name="software_state"
                    label="Software State"
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
                    <Form.Item name={['checked', 'cluster']} valuePropName="checked" noStyle>
                      <Checkbox>Cluster</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cluster'
                  )}
                  <Form.Item name="cluster" label="Cluster" className="m-0" rules={[{ max: 510 }]}>
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
                      <Checkbox>Operating System</Checkbox>
                    </Form.Item>
                  ) : (
                    'Operating System'
                  )}
                  <Form.Item
                    name="operating_system"
                    label="Operating System"
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
                    <Form.Item name={['checked', 'fqdn']} valuePropName="checked" noStyle>
                      <Checkbox>FQDN</Checkbox>
                    </Form.Item>
                  ) : (
                    'FQDN'
                  )}
                  <Form.Item name="fqdn" label="FQDN" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cost_code']} valuePropName="checked" noStyle>
                      <Checkbox>Cost Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost Code'
                  )}
                  <Form.Item
                    name="cost_code"
                    label="Cost Code"
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
                      name={['checked', 'line_of_business']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Line of Business</Checkbox>
                    </Form.Item>
                  ) : (
                    'Line of Business'
                  )}
                  <Form.Item
                    name="line_of_business"
                    label="Line of Business"
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
                    <Form.Item name={['checked', 'market']} valuePropName="checked" noStyle>
                      <Checkbox>Market</Checkbox>
                    </Form.Item>
                  ) : (
                    'Market'
                  )}
                  <Form.Item name="market" label="Market" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'application']} valuePropName="checked" noStyle>
                      <Checkbox>Application</Checkbox>
                    </Form.Item>
                  ) : (
                    'Application'
                  )}
                  <Form.Item
                    name="application"
                    label="Application"
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
                    <Form.Item name={['checked', 'data_center']} valuePropName="checked" noStyle>
                      <Checkbox>Datacenter</Checkbox>
                    </Form.Item>
                  ) : (
                    'Datacenter'
                  )}
                  <Form.Item
                    name="data_center"
                    label="Datacenter"
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
                    <Form.Item name={['checked', 'serial_number']} valuePropName="checked" noStyle>
                      <Checkbox>Serial Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Serial Number'
                  )}
                  <Form.Item
                    name="serial_number"
                    label="Serial Number"
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
                    <Form.Item name={['checked', 'sc_version']} valuePropName="checked" noStyle>
                      <Checkbox>SC Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'SC Version'
                  )}
                  <Form.Item
                    name="sc_version"
                    label="SC Version"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ha_enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ha_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>HA Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'HA Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="azure_hosted" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'azure_hosted']} valuePropName="checked" noStyle>
                      <Checkbox>Azure Hosted</Checkbox>
                    </Form.Item>
                  ) : (
                    'Azure Hosted'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="drs_enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'drs_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>DRS Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'DRS Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="exempt" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exempt']} valuePropName="checked" noStyle>
                      <Checkbox>Exempt</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exempt'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="sc_exempt" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sc_exempt']} valuePropName="checked" noStyle>
                      <Checkbox>SC Exempt</Checkbox>
                    </Form.Item>
                  ) : (
                    'SC Exempt'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="sc_server" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sc_server']} valuePropName="checked" noStyle>
                      <Checkbox>SC Server</Checkbox>
                    </Form.Item>
                  ) : (
                    'SC Server'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="sc_agent" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sc_agent']} valuePropName="checked" noStyle>
                      <Checkbox>SC Agent</Checkbox>
                    </Form.Item>
                  ) : (
                    'SC Agent'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={inventory.save.loading || commonLookups.save.loading}
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
export default AddWindowsServerInventoryModal;
