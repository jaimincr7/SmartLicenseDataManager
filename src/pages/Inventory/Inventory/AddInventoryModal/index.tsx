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
import { IInventory } from '../../../../services/inventory/inventory/inventory.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getOSNormalizationLookup,
  getSoftwareNormalizationLookup,
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
  saveInventory,
  getInventoryById,
} from '../../../../store/inventory/inventory/inventory.action';
import {
  inventorySelector,
  clearInventoryMessages,
  clearInventoryGetById,
} from '../../../../store/inventory/inventory/inventory.reducer';
import { IAddInventoryProps } from './addInventory.model';

const { Option } = Select;

const AddInventoryModal: React.FC<IAddInventoryProps> = (props) => {
  const inventory = useAppSelector(inventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Inventory} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IInventory = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    source: null,
    publisher: null,
    software_title: null,
    software_version: null,
    product_id: null,
    device_name: null,
    domain_name: null,
    operating_system: null,
    manufacturer: null,
    device_model: null,
    device_serial: null,
    processor_desc: null,
    processor_count: null,
    cores_per_processor: null,
    core_count: null,
    username: null,
    last_hw_scan: null,
    last_sw_scan: null,
    date_installed: null,
    is_virtual: false,
    software_normalization_id: null,
    operating_system_normalization_id: null,
    os: '',
    instance_count: null,
    quantity: null,
    exclude: '',
    on_server: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IInventory = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_installed = passDateToApi(inputValues.date_installed, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    inputValues.last_sw_scan = passDateToApi(inputValues.last_sw_scan, true);
    inputValues.last_hw_scan = passDateToApi(inputValues.last_hw_scan, true);
    if (!isMultiple) {
      dispatch(saveInventory(inputValues));
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

  const fillValuesOnEdit = async (data: IInventory) => {
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
        source: data.source,
        publisher: data.publisher,
        software_title: data.software_title,
        software_version: data.software_version,
        product_id: data.product_id,
        device_name: data.device_name,
        domain_name: data.domain_name,
        operating_system: data.operating_system,
        manufacturer: data.manufacturer,
        device_model: data.device_model,
        device_serial: data.device_serial,
        processor_desc: data.processor_desc,
        processor_count: data.processor_count,
        cores_per_processor: data.cores_per_processor,
        core_count: data.core_count,
        username: data.username,
        last_hw_scan: _.isNull(data.last_hw_scan) ? null : forEditModal(data.last_hw_scan),
        last_sw_scan: _.isNull(data.last_sw_scan) ? null : forEditModal(data.last_sw_scan),
        is_virtual: data.is_virtual,
        date_installed: _.isNull(data.date_installed) ? null : forEditModal(data.date_installed),
        software_normalization_id: _.isNull(data.software_normalization_id)
          ? null
          : data.software_normalization_id,
        operating_system_normalization_id: _.isNull(data.operating_system_normalization_id)
          ? null
          : data.operating_system_normalization_id,
        os: data.os,
        instance_count: _.isNull(data.instance_count) ? null : data.instance_count,
        quantity: _.isNull(data.quantity) ? null : data.quantity,
        exclude: data.exclude,
        on_server: data.on_server,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
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
      dispatch(clearInventoryMessages());
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
    dispatch(getSoftwareNormalizationLookup());
    dispatch(getOSNormalizationLookup());
    if (+id > 0) {
      dispatch(getInventoryById(+id));
    }
    return () => {
      dispatch(clearInventoryGetById());
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
            name="addInventory"
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
                    <Form.Item
                      name={['checked', 'software_normalization_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Software Normalization</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software Normalization'
                  )}
                  <Form.Item
                    name="software_normalization_id"
                    className="m-0"
                    label="Software Normalization"
                  >
                    <Select
                      allowClear
                      dropdownClassName="value-box-select"
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
                      {commonLookups?.softwareNormalizationLookup?.data.map((option: ILookup) => (
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
                      name={['checked', 'operating_system_normalization_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Operating System Normalization</Checkbox>
                    </Form.Item>
                  ) : (
                    'Operating System Normalization'
                  )}
                  <Form.Item
                    name="operating_system_normalization_id"
                    className="m-0"
                    label="Operating System Normalization"
                  >
                    <Select
                      allowClear
                      dropdownClassName="value-box-select"
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
                      {commonLookups?.osNormalizationLookup?.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'source']} valuePropName="checked" noStyle>
                      <Checkbox>Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Source'
                  )}
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'publisher']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher'
                  )}
                  <Form.Item
                    name="publisher"
                    className="m-0"
                    label="Publisher"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'software_title']} valuePropName="checked" noStyle>
                      <Checkbox>Software Title</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software Title'
                  )}
                  <Form.Item
                    name="software_title"
                    label="Software Title"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'software_version']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Software Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software Version'
                  )}
                  <Form.Item
                    name="software_version"
                    label="Software Version"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product_id']} valuePropName="checked" noStyle>
                      <Checkbox>Product ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product ID'
                  )}
                  <Form.Item
                    name="product_id"
                    label="Product ID"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
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
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'domain_name']} valuePropName="checked" noStyle>
                      <Checkbox>Domain Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Domain Name'
                  )}
                  <Form.Item
                    name="domain_name"
                    label="Domain Name"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
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
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'manufacturer']} valuePropName="checked" noStyle>
                      <Checkbox>Manufacturer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Manufacturer'
                  )}
                  <Form.Item
                    name="manufacturer"
                    label="Manufacturer"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'device_model']} valuePropName="checked" noStyle>
                      <Checkbox>Device Model</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Model'
                  )}
                  <Form.Item
                    name="device_model"
                    label="Device Model"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'device_serial']} valuePropName="checked" noStyle>
                      <Checkbox>Device Serial</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Serial'
                  )}
                  <Form.Item
                    name="device_serial"
                    label="Device Serial"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
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
                    <Form.Item name={['checked', 'processor_desc']} valuePropName="checked" noStyle>
                      <Checkbox>Processor Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Processor Description'
                  )}
                  <Form.Item
                    name="processor_desc"
                    label="Processor Description"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'processor_count']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Processor Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Processor Count'
                  )}
                  <Form.Item
                    name="processor_count"
                    label="Processor Count"
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
                    <Form.Item
                      name={['checked', 'cores_per_processor']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cores Per Processor</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cores Per Processor'
                  )}
                  <Form.Item
                    name="cores_per_processor"
                    label="Cores Per Processor"
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
                    <Form.Item name={['checked', 'core_count']} valuePropName="checked" noStyle>
                      <Checkbox>Core Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Core Count'
                  )}
                  <Form.Item
                    name="core_count"
                    label="Core Count"
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
                    <Form.Item name={['checked', 'username']} valuePropName="checked" noStyle>
                      <Checkbox>Username</Checkbox>
                    </Form.Item>
                  ) : (
                    'Username'
                  )}
                  <Form.Item
                    name="username"
                    label="Username"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_hw_scan']} valuePropName="checked" noStyle>
                      <Checkbox>Last HW Scan</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last HW Scan'
                  )}
                  <Form.Item name="last_hw_scan" label="Last HW Scan" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_sw_scan']} valuePropName="checked" noStyle>
                      <Checkbox>Last SW Scan</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last SW Scan'
                  )}
                  <Form.Item name="last_sw_scan" label="Last SW Scan" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'os']} valuePropName="checked" noStyle>
                      <Checkbox>OS</Checkbox>
                    </Form.Item>
                  ) : (
                    'OS'
                  )}
                  <Form.Item name="os" label="OS" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exclude']} valuePropName="checked" noStyle>
                      <Checkbox>Exclude</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclude'
                  )}
                  <Form.Item name="exclude" label="Exclude" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'on_server']} valuePropName="checked" noStyle>
                      <Checkbox>On Server</Checkbox>
                    </Form.Item>
                  ) : (
                    'On Server'
                  )}
                  <Form.Item
                    name="on_server"
                    label="On Server"
                    className="m-0"
                    rules={[{ max: 10 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'instance_count']} valuePropName="checked" noStyle>
                      <Checkbox>Instance Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance Count'
                  )}
                  <Form.Item
                    name="instance_count"
                    label="Instance Count"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'quantity']} valuePropName="checked" noStyle>
                      <Checkbox>Quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quantity'
                  )}
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_installed']} valuePropName="checked" noStyle>
                      <Checkbox>Date Installed</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Installed'
                  )}
                  <Form.Item
                    name="date_installed"
                    label="Date Installed"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_virtual" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_virtual']} valuePropName="checked" noStyle>
                      <Checkbox>Is Virtual</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Virtual'
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
export default AddInventoryModal;
