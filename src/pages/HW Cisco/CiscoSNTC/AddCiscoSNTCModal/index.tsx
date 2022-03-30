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
import { ICiscoSNTC } from '../../../../services/hwCisco/ciscoSNTC/ciscoSNTC.model';
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
  saveCiscoSNTC,
  getCiscoSNTCById,
} from '../../../../store/hwCisco/ciscoSNTC/ciscoSNTC.action';
import {
  ciscoSNTCSelector,
  clearCiscoSNTCMessages,
  clearCiscoSNTCGetById,
} from '../../../../store/hwCisco/ciscoSNTC/ciscoSNTC.reducer';
import { IAddCiscoSNTCProps } from './addCiscoSNTC.model';

const { Option } = Select;

const AddCiscoSNTCModal: React.FC<IAddCiscoSNTCProps> = (props) => {
  const ciscoSNTC = useAppSelector(ciscoSNTCSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoSNTC} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoSNTC = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    source: '',
    hostname: '',
    snmp_sys_name: '',
    ip_address: '',
    mac_address: '',
    serial_number: '',
    collected_sn: '',
    parent_sn: '',
    instance_no: null,
    p_c_s: '',
    parent_instance_id: null,
    product_id: '',
    product_name: '',
    product_description: '',
    product_family: '',
    product_subtype: '',
    product_type: '',
    equipment_type: '',
    coverage_start: '',
    coverage_end: '',
    contract_no: '',
    contract_status: '',
    service_level: '',
    service_level_description: '',
    service_program: '',
    bill_to_customer: '',
    warranty_type: '',
    warranty_start: null,
    warranty_end: null,
    snmp_sys_location: '',
    installed_at_site_id: null,
    installed_at_site: '',
    installed_at_address: '',
    installed_at_city: '',
    installed_at_state: '',
    installed_at_province: '',
    installed_at_postal_code: null,
    installed_at_country: '',
    ship_to_address: '',
    ship_date: null,
    sw_type: '',
    sw_version: '',
    feature_set: '',
    hw_revision: null,
    bootstrap_version: '',
    installed_memory: '',
    installed_flash: '',
    running_config: '',
    startup_config: '',
    hw_alerts: null,
    hw_l_do_s: null,
    sw_alerts: '',
    security_advisory_psirt: '',
    field_notices: null,
    customer: '',
    inventory: '',
    segment: '',
    collection_date: null,
    appliance_id: '',
    imported_by: '',
    imported_file: '',
    sn_recognized: '',
    device_diagnostics_supported: '',
    relationship: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoSNTC = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.warranty_start = passDateToApi(inputValues.warranty_start, true);
    inputValues.warranty_end = passDateToApi(inputValues.warranty_end, true);
    inputValues.ship_date = passDateToApi(inputValues.ship_date, true);
    inputValues.hw_l_do_s = passDateToApi(inputValues.hw_l_do_s, true);
    inputValues.collection_date = passDateToApi(inputValues.collection_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoSNTC(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoSNTC.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoSNTC) => {
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
        hostname: data.hostname,
        snmp_sys_name: data.snmp_sys_name,
        ip_address: data.ip_address,
        mac_address: data.mac_address,
        serial_number: data.serial_number,
        collected_sn: data.collected_sn,
        parent_sn: data.parent_sn,
        instance_no: data.instance_no,
        p_c_s: data.p_c_s,
        parent_instance_id: data.parent_instance_id,
        product_id: data.product_id,
        product_name: data.product_name,
        product_description: data.product_description,
        product_family: data.product_family,
        product_subtype: data.product_subtype,
        product_type: data.product_type,
        equipment_type: data.equipment_type,
        coverage_start: data.coverage_start,
        coverage_end: data.coverage_end,
        contract_no: data.contract_no,
        contract_status: data.contract_status,
        service_level: data.service_level,
        service_level_description: data.service_level_description,
        service_program: data.service_program,
        bill_to_customer: data.bill_to_customer,
        warranty_type: data.warranty_type,
        warranty_start: _.isNull(data.warranty_start) ? null : forEditModal(data.warranty_start),
        warranty_end: _.isNull(data.warranty_end) ? null : forEditModal(data.warranty_end),
        snmp_sys_location: data.snmp_sys_location,
        installed_at_site_id: data.installed_at_site_id,
        installed_at_site: data.installed_at_site,
        installed_at_address: data.installed_at_address,
        installed_at_city: data.installed_at_city,
        installed_at_state: data.installed_at_state,
        installed_at_province: data.installed_at_province,
        installed_at_postal_code: data.installed_at_postal_code,
        installed_at_country: data.installed_at_country,
        ship_to_address: data.ship_to_address,
        ship_date: _.isNull(data.ship_date) ? null : forEditModal(data.ship_date),
        sw_type: data.sw_type,
        sw_version: data.sw_version,
        feature_set: data.feature_set,
        hw_revision: data.hw_revision,
        bootstrap_version: data.bootstrap_version,
        installed_memory: data.installed_memory,
        installed_flash: data.installed_flash,
        running_config: data.running_config,
        startup_config: data.startup_config,
        hw_alerts: data.hw_alerts,
        hw_l_do_s: _.isNull(data.hw_l_do_s) ? null : forEditModal(data.hw_l_do_s),
        sw_alerts: data.sw_alerts,
        security_advisory_psirt: data.security_advisory_psirt,
        field_notices: data.field_notices,
        customer: data.customer,
        inventory: data.inventory,
        segment: data.segment,
        collection_date: _.isNull(data.collection_date) ? null : forEditModal(data.collection_date),
        appliance_id: data.appliance_id,
        imported_by: data.imported_by,
        imported_file: data.imported_file,
        sn_recognized: data.sn_recognized,
        device_diagnostics_supported: data.device_diagnostics_supported,
        relationship: data.relationship,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoSNTC.save.messages.length > 0) {
      if (ciscoSNTC.save.hasErrors) {
        toast.error(ciscoSNTC.save.messages.join(' '));
      } else {
        toast.success(ciscoSNTC.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoSNTCMessages());
    }
  }, [ciscoSNTC.save.messages]);

  useEffect(() => {
    if (+id > 0 && ciscoSNTC.getById.data) {
      const data = ciscoSNTC.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoSNTC.getById.data]);

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
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoSNTCById(+id));
    }
    return () => {
      dispatch(clearCiscoSNTCGetById());
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
      if (globalSearch.company_id) {
        dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        dispatch(getBULookup(globalSearch.company_id[0]));
        const initialValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initialValues);
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
        {ciscoSNTC.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoSNTC.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoSNTC"
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
                    <Form.Item name={['checked', 'hostname']} valuePropName="checked" noStyle>
                      <Checkbox>Host Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host Name'
                  )}
                  <Form.Item
                    name="hostname"
                    className="m-0"
                    label="Host Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'snmp_sys_name']} valuePropName="checked" noStyle>
                      <Checkbox>SNMP sysName</Checkbox>
                    </Form.Item>
                  ) : (
                    'SNMP sysName'
                  )}
                  <Form.Item
                    name="snmp_sys_name"
                    className="m-0"
                    label="SNMP sysName"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ip_address']} valuePropName="checked" noStyle>
                      <Checkbox>IP Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'IP Address'
                  )}
                  <Form.Item
                    name="ip_address"
                    className="m-0"
                    label="IP Address"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'mac_address']} valuePropName="checked" noStyle>
                      <Checkbox>Mac Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mac Address'
                  )}
                  <Form.Item
                    name="mac_address"
                    className="m-0"
                    label="Mac Address"
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
                    className="m-0"
                    label="Serial Number"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'collected_sn']} valuePropName="checked" noStyle>
                      <Checkbox>Collected SN</Checkbox>
                    </Form.Item>
                  ) : (
                    'Collected SN'
                  )}
                  <Form.Item
                    name="collected_sn"
                    className="m-0"
                    label="Collected SN"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'parent_sn']} valuePropName="checked" noStyle>
                      <Checkbox>Parent SN</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent SN'
                  )}
                  <Form.Item
                    name="parent_sn"
                    className="m-0"
                    label="Parent SN"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'p_c_s']} valuePropName="checked" noStyle>
                      <Checkbox>P/C/S</Checkbox>
                    </Form.Item>
                  ) : (
                    'P/C/S'
                  )}
                  <Form.Item name="p_c_s" className="m-0" label="P/C/S" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_instance_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Instance ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Instance ID'
                  )}
                  <Form.Item
                    name="parent_instance_id"
                    className="m-0"
                    label="Parent Instance ID"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
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
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product_name']} valuePropName="checked" noStyle>
                      <Checkbox>Product Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Name'
                  )}
                  <Form.Item
                    name="product_name"
                    className="m-0"
                    label="Product Name"
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
                      name={['checked', 'product_description']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Description'
                  )}
                  <Form.Item
                    name="product_description"
                    className="m-0"
                    label="Product Description"
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
                    className="m-0"
                    label="Product Family"
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
                      name={['checked', 'product_subtype']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Subtype</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Subtype'
                  )}
                  <Form.Item
                    name="product_subtype"
                    className="m-0"
                    label="Product Subtype"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product_type']} valuePropName="checked" noStyle>
                      <Checkbox>Product Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Type'
                  )}
                  <Form.Item
                    name="product_type"
                    className="m-0"
                    label="Product Type"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'equipment_type']} valuePropName="checked" noStyle>
                      <Checkbox>Equipment Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Equipment Type'
                  )}
                  <Form.Item
                    name="equipment_type"
                    className="m-0"
                    label="Equipment Type"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'coverage_start']} valuePropName="checked" noStyle>
                      <Checkbox>Coverage Start</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Start'
                  )}
                  <Form.Item
                    name="coverage_start"
                    className="m-0"
                    label="Coverage Start"
                    rules={[{ max: 510 }]}
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
                    <Form.Item name={['checked', 'coverage_end']} valuePropName="checked" noStyle>
                      <Checkbox>Coverage End</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage End'
                  )}
                  <Form.Item
                    name="coverage_end"
                    className="m-0"
                    label="Coverage End"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'contract_no']} valuePropName="checked" noStyle>
                      <Checkbox>Contract No#</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract No#'
                  )}
                  <Form.Item
                    name="contract_no"
                    className="m-0"
                    label="Contract No#"
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
                      name={['checked', 'contract_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contract Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Status'
                  )}
                  <Form.Item
                    name="contract_status"
                    className="m-0"
                    label="Contract Status"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_level']} valuePropName="checked" noStyle>
                      <Checkbox>Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level'
                  )}
                  <Form.Item
                    name="service_level"
                    className="m-0"
                    label="Service Level"
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
                      name={['checked', 'service_level_description']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Level Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level Description'
                  )}
                  <Form.Item
                    name="service_level_description"
                    className="m-0"
                    label="Service Level Description"
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
                      name={['checked', 'service_program']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Program</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Program'
                  )}
                  <Form.Item
                    name="service_program"
                    className="m-0"
                    label="Service Program"
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
                      name={['checked', 'bill_to_customer']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Bill-to Customer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Bill-to Customer'
                  )}
                  <Form.Item
                    name="bill_to_customer"
                    className="m-0"
                    label="Bill-to Customer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warranty_type']} valuePropName="checked" noStyle>
                      <Checkbox>Warranty Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty Type'
                  )}
                  <Form.Item
                    name="warranty_type"
                    className="m-0"
                    label="Warranty Type"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warranty_start']} valuePropName="checked" noStyle>
                      <Checkbox>Warranty Start</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty Start'
                  )}
                  <Form.Item name="warranty_start" className="m-0" label="Warranty Start">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warranty_end']} valuePropName="checked" noStyle>
                      <Checkbox>Warranty End</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty End'
                  )}
                  <Form.Item name="warranty_end" className="m-0" label="Warranty End">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'snmp_sys_location']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>SNMP sysLocation</Checkbox>
                    </Form.Item>
                  ) : (
                    'SNMP sysLocation'
                  )}
                  <Form.Item
                    name="snmp_sys_location"
                    className="m-0"
                    label="SNMP sysLocation"
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
                      name={['checked', 'installed_at_site_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Site ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Site ID'
                  )}
                  <Form.Item
                    name="installed_at_site_id"
                    className="m-0"
                    label="Installed-at Site ID"
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
                      name={['checked', 'installed_at_site']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Site</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Site'
                  )}
                  <Form.Item
                    name="installed_at_site"
                    className="m-0"
                    label="Installed-at Site"
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
                      name={['checked', 'installed_at_address']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Address'
                  )}
                  <Form.Item
                    name="installed_at_address"
                    className="m-0"
                    label="Installed-at Address"
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
                      name={['checked', 'installed_at_city']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at City</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at City'
                  )}
                  <Form.Item
                    name="installed_at_city"
                    className="m-0"
                    label="Installed-at City"
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
                      name={['checked', 'installed_at_state']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at State'
                  )}
                  <Form.Item
                    name="installed_at_state"
                    className="m-0"
                    label="Installed-at State"
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
                      name={['checked', 'installed_at_province']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Province</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Province'
                  )}
                  <Form.Item
                    name="installed_at_province"
                    className="m-0"
                    label="Installed-at Province"
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
                      name={['checked', 'installed_at_postal_code']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Postal Code'
                  )}
                  <Form.Item
                    name="installed_at_postal_code"
                    className="m-0"
                    label="Installed-at Postal Code"
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
                      name={['checked', 'installed_at_country']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed-at Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed-at Country'
                  )}
                  <Form.Item
                    name="installed_at_country"
                    className="m-0"
                    label="Installed-at Country"
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
                      name={['checked', 'ship_to_address']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Ship-to Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ship-to Address'
                  )}
                  <Form.Item
                    name="ship_to_address"
                    className="m-0"
                    label="Ship-to Address"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ship_date']} valuePropName="checked" noStyle>
                      <Checkbox>Ship Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ship Date'
                  )}
                  <Form.Item name="ship_date" className="m-0" label="Ship Date">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sw_type']} valuePropName="checked" noStyle>
                      <Checkbox>SW Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'SW Type'
                  )}
                  <Form.Item name="sw_type" className="m-0" label="SW Type" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sw_version']} valuePropName="checked" noStyle>
                      <Checkbox>SW Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'SW Version'
                  )}
                  <Form.Item
                    name="sw_version"
                    label="SW Version"
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
                    <Form.Item name={['checked', 'feature_set']} valuePropName="checked" noStyle>
                      <Checkbox>Feature Set</Checkbox>
                    </Form.Item>
                  ) : (
                    'Feature Set'
                  )}
                  <Form.Item
                    name="feature_set"
                    label="Feature Set"
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
                    <Form.Item name={['checked', 'hw_revision']} valuePropName="checked" noStyle>
                      <Checkbox>HW Revision</Checkbox>
                    </Form.Item>
                  ) : (
                    'HW Revision'
                  )}
                  <Form.Item
                    name="hw_revision"
                    label="HW Revision"
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
                      name={['checked', 'bootstrap_version']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Bootstrap Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Bootstrap Version'
                  )}
                  <Form.Item
                    name="bootstrap_version"
                    label="Bootstrap Version"
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
                      name={['checked', 'installed_flash']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Flash</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Flash'
                  )}
                  <Form.Item
                    name="installed_flash"
                    label="Installed Flash"
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
                    <Form.Item name={['checked', 'running_config']} valuePropName="checked" noStyle>
                      <Checkbox>Running Config</Checkbox>
                    </Form.Item>
                  ) : (
                    'Running Config'
                  )}
                  <Form.Item
                    name="running_config"
                    label="Running Config"
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
                    <Form.Item name={['checked', 'startup_config']} valuePropName="checked" noStyle>
                      <Checkbox>Startup Config</Checkbox>
                    </Form.Item>
                  ) : (
                    'Startup Config'
                  )}
                  <Form.Item
                    name="startup_config"
                    label="Startup Config"
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
                    <Form.Item name={['checked', 'hw_alerts']} valuePropName="checked" noStyle>
                      <Checkbox>HW Alerts</Checkbox>
                    </Form.Item>
                  ) : (
                    'HW Alerts'
                  )}
                  <Form.Item
                    name="hw_alerts"
                    label="HW Alerts"
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
                    <Form.Item name={['checked', 'hw_l_do_s']} valuePropName="checked" noStyle>
                      <Checkbox>HW LDoS</Checkbox>
                    </Form.Item>
                  ) : (
                    'HW LDoS'
                  )}
                  <Form.Item name="hw_l_do_s" label="HW LDoS" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sw_alerts']} valuePropName="checked" noStyle>
                      <Checkbox>SW Alerts</Checkbox>
                    </Form.Item>
                  ) : (
                    'SW Alerts'
                  )}
                  <Form.Item
                    name="sw_alerts"
                    label="SW Alerts"
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
                      name={['checked', 'security_advisory_psirt']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Security Advisory (PSIRT)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Security Advisory (PSIRT)'
                  )}
                  <Form.Item
                    name="security_advisory_psirt"
                    label="Security Advisory (PSIRT)"
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
                    <Form.Item name={['checked', 'field_notices']} valuePropName="checked" noStyle>
                      <Checkbox>Field Notices</Checkbox>
                    </Form.Item>
                  ) : (
                    'Field Notices'
                  )}
                  <Form.Item
                    name="field_notices"
                    label="Field Notices"
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
                    <Form.Item name={['checked', 'customer']} valuePropName="checked" noStyle>
                      <Checkbox>Customer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Customer'
                  )}
                  <Form.Item
                    name="customer"
                    label="Customer"
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
                    <Form.Item name={['checked', 'inventory']} valuePropName="checked" noStyle>
                      <Checkbox>Inventory</Checkbox>
                    </Form.Item>
                  ) : (
                    'Inventory'
                  )}
                  <Form.Item
                    name="inventory"
                    label="Inventory"
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
                    <Form.Item name={['checked', 'segment']} valuePropName="checked" noStyle>
                      <Checkbox>Segment</Checkbox>
                    </Form.Item>
                  ) : (
                    'Segment'
                  )}
                  <Form.Item name="segment" label="Segment" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'collection_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Collection Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Collection Date'
                  )}
                  <Form.Item name="collection_date" label="Collection Date" className="m-0">
                    <DatePicker className="form-control w-100 w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'appliance_id']} valuePropName="checked" noStyle>
                      <Checkbox>Appliance ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Appliance ID'
                  )}
                  <Form.Item
                    name="appliance_id"
                    label="Appliance ID"
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
                    <Form.Item name={['checked', 'imported_by']} valuePropName="checked" noStyle>
                      <Checkbox>Imported By</Checkbox>
                    </Form.Item>
                  ) : (
                    'Imported By'
                  )}
                  <Form.Item
                    name="imported_by"
                    label="Imported By"
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
                    <Form.Item name={['checked', 'imported_file']} valuePropName="checked" noStyle>
                      <Checkbox>Imported File</Checkbox>
                    </Form.Item>
                  ) : (
                    'Imported File'
                  )}
                  <Form.Item
                    name="imported_file"
                    label="Imported File"
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
                    <Form.Item name={['checked', 'sn_recognized']} valuePropName="checked" noStyle>
                      <Checkbox>SN Recognized</Checkbox>
                    </Form.Item>
                  ) : (
                    'SN Recognized'
                  )}
                  <Form.Item
                    name="sn_recognized"
                    label="SN Recognized"
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
                      name={['checked', 'device_diagnostics_supported']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Device Diagnostics Supported</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Diagnostics Supported'
                  )}
                  <Form.Item
                    name="device_diagnostics_supported"
                    label="Device Diagnostics Supported"
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
                    <Form.Item name={['checked', 'relationship']} valuePropName="checked" noStyle>
                      <Checkbox>Relationship</Checkbox>
                    </Form.Item>
                  ) : (
                    'Relationship'
                  )}
                  <Form.Item
                    name="relationship"
                    label="Relationship"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoSNTC.save.loading || commonLookups.save.loading}
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
export default AddCiscoSNTCModal;
