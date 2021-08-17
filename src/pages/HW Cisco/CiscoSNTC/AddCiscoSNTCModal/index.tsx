import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoSNTC } from '../../../../services/hwCisco/ciscoSNTC/ciscoSNTC.model';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
    date_added: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoSNTC = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCiscoSNTC(inputValues));
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
        warranty_start: _.isNull(data.warranty_start) ? null : moment(data.warranty_start),
        warranty_end: _.isNull(data.warranty_end) ? null : moment(data.warranty_end),
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
        ship_date: _.isNull(data.ship_date) ? null : moment(data.ship_date),
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
        hw_l_do_s: _.isNull(data.hw_l_do_s) ? null : moment(data.hw_l_do_s),
        sw_alerts: data.sw_alerts,
        security_advisory_psirt: data.security_advisory_psirt,
        field_notices: data.field_notices,
        customer: data.customer,
        inventory: data.inventory,
        segment: data.segment,
        collection_date: _.isNull(data.collection_date) ? null : moment(data.collection_date),
        appliance_id: data.appliance_id,
        imported_by: data.imported_by,
        imported_file: data.imported_file,
        sn_recognized: data.sn_recognized,
        device_diagnostics_supported: data.device_diagnostics_supported,
        relationship: data.relationship,
        date_added: data.date_added,
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
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Host Name</label>
                  <Form.Item
                    name="hostname"
                    className="m-0"
                    label="Hostname"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SNMP sysName</label>
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
                  <label className="label">IP Address</label>
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
                  <label className="label">Mac Address</label>
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
                  <label className="label">Serial Number</label>
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
                  <label className="label">Collected SN</label>
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
                  <label className="label">Parent SN</label>
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
                  <label className="label">P/C/S</label>
                  <Form.Item name="p_c_s" className="m-0" label="P/C/S" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Parent Instance ID</label>
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
                  <label className="label">Product ID</label>
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
                  <label className="label">Product Name</label>
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
                  <label className="label">Product Description</label>
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
                  <label className="label">Product Family</label>
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
                  <label className="label">Product Sub Type</label>
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
                  <label className="label">Product Type</label>
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
                  <label className="label">Equipment Type</label>
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
                  <label className="label">Coverage Start</label>
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
                  <label className="label">Coverage End</label>
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
                  <label className="label">Contract No#</label>
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
                  <label className="label">Contract Status</label>
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
                  <label className="label">Service Level</label>
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
                  <label className="label">Service Level Description</label>
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
                  <label className="label">Service Program</label>
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
                  <label className="label">Bill To Customer</label>
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
                  <label className="label">Warranty Type</label>
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
                  <label className="label">Warranty Start</label>
                  <Form.Item name="warranty_start" className="m-0" label="Warranty Start">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Warranty End</label>
                  <Form.Item name="warranty_end" className="m-0" label="Warranty End">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SNMP sysLocation</label>
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
                  <label className="label">Installed at Site ID</label>
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
                  <label className="label">Installed at Site</label>
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
                  <label className="label">Installed at Address</label>
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
                  <label className="label">Installed at City</label>
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
                  <label className="label">Installed at State</label>
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
                  <label className="label">Installed at Province</label>
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
                  <label className="label">Installed at Postal Code</label>
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
                  <label className="label">Installed at Country</label>
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
                  <label className="label">Ship to Address</label>
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
                  <label className="label">Ship Date</label>
                  <Form.Item name="ship_date" className="m-0" label="Ship Date">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SW Type</label>
                  <Form.Item name="sw_type" className="m-0" label="SW Type" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SW Version</label>
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
                  <label className="label">Feature Set</label>
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
                  <label className="label">HW Revision</label>
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
                  <label className="label">Bootstrap Version</label>
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
                  <label className="label">Installed Flash</label>
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
                  <label className="label">Running Config</label>
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
                  <label className="label">Startup Config</label>
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
                  <label className="label">HW Alerts</label>
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
                  <label className="label">HW LDoS</label>
                  <Form.Item name="hw_l_do_s" label="HW LDoS" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SW Alerts</label>
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
                  <label className="label">Security Advisory (PSIRT)</label>
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
                  <label className="label">Field Notices</label>
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
                  <label className="label">Customer</label>
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
                  <label className="label">Inventory</label>
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
                  <label className="label">Segment</label>
                  <Form.Item name="segment" label="Segment" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Collection Date</label>
                  <Form.Item name="collection_date" label="Collection Date" className="m-0">
                    <DatePicker className="form-control w-100 w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Appliance ID</label>
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
                  <label className="label">Imported By</label>
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
                  <label className="label">Imported File</label>
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
                  <label className="label">SN Recognized</label>
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
                  <label className="label">Device Diagnostics Supported</label>
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
                  <label className="label">Relationship</label>
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
                loading={ciscoSNTC.save.loading}
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
