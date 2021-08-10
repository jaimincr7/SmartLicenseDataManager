import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoIB } from '../../../../services/hwCisco/ciscoIB/ciscoIB.model';
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
import { saveCiscoIB, getCiscoIBById } from '../../../../store/hwCisco/ciscoIB/ciscoIB.action';
import {
  ciscoIBSelector,
  clearCiscoIBMessages,
  clearCiscoIBGetById,
} from '../../../../store/hwCisco/ciscoIB/ciscoIB.reducer';
import { IAddCiscoIBProps } from './addCiscoIB.model';

const { Option } = Select;

const AddCiscoIBModal: React.FC<IAddCiscoIBProps> = (props) => {
  const ciscoIB = useAppSelector(ciscoIBSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoIB} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoIB = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    customer_name: '',
    asset_id: '',
    unique_record: '',
    duplicate_record: '',
    duplicate_coverage: '',
    zone_assignment: '',
    zone_description: '',
    serial_number: '',
    instance_number: null,
    parent_serial_number: '',
    parent_instance_number: null,
    product_relationship: '',
    product_id: '',
    product_description: '',
    product_quantity: null,
    product_family: '',
    architecture_group: '',
    architecture_sub_group: '',
    item_type: '',
    network: '',
    installed_base_status: '',
    serviceable: '',
    renewable: '',
    host_name: '',
    hardware_list_price: null,
    maintenance_list_price: '',
    hardware_bill_to_name: '',
    ship_to_customer_name: '',
    best_available_ship_date: '',
    shipped_within_5_years: '',
    gu_id: null,
    gu_name: '',
    region: '',
    business_unit: '',
    installed_site_id: null,
    installed_site_name: '',
    installed_site_address_1: '',
    installed_site_city: '',
    installed_site_state: '',
    installed_site_province: '',
    installed_site_postal_code: null,
    installed_site_country: '',
    covered_line_status: '',
    coverage_status: '',
    contract_number: null,
    contract_bill_to_name: '',
    contract_bill_to_country: '',
    service_level: '',
    service_level_description: '',
    service_level_category: '',
    product_coverage_line_number: '',
    covered_line_start_date: '',
    covered_line_end_date: '',
    expiration_range: '',
    termination_date: null,
    last_date_of_support: '',
    l_do_s_category: '',
    warranty_type: '',
    warranty_end_date: '',
    hardware_po_number: '',
    hardware_so_number: null,
    maintenance_po_number: '',
    maintenance_so_number: '',
    end_of_sale_date: null,
    end_of_routine_failure_analysis_date: '',
    end_of_new_service_attachment_date: '',
    end_of_service_contract_renewal: '',
    end_of_sig_releases_date: '',
    end_of_security_support_date: '',
    end_of_software_availability_date: '',
    end_of_software_license_availability_date: '',
    end_of_software_date: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoIB = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCiscoIB(inputValues));
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

  const fillValuesOnEdit = async (data: ICiscoIB) => {
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
        customer_name: data.customer_name,
        asset_id: data.asset_id,
        unique_record: data.unique_record,
        duplicate_record: data.duplicate_record,
        duplicate_coverage: data.duplicate_coverage,
        zone_assignment: data.zone_assignment,
        zone_description: data.zone_description,
        serial_number: data.serial_number,
        instance_number: data.instance_number,
        parent_serial_number: data.parent_serial_number,
        parent_instance_number: data.parent_instance_number,
        product_relationship: data.product_relationship,
        product_id: data.product_id,
        product_description: data.product_description,
        product_quantity: data.product_quantity,
        product_family: data.product_family,
        architecture_group: data.architecture_group,
        architecture_sub_group: data.architecture_sub_group,
        item_type: data.item_type,
        network: data.network,
        installed_base_status: data.installed_base_status,
        serviceable: data.serviceable,
        renewable: data.renewable,
        host_name: data.host_name,
        hardware_list_price: data.hardware_list_price,
        maintenance_list_price: data.maintenance_list_price,
        hardware_bill_to_name: data.hardware_bill_to_name,
        ship_to_customer_name: data.ship_to_customer_name,
        best_available_ship_date: _.isNull(data.best_available_ship_date)
          ? null
          : moment(data.best_available_ship_date),
        shipped_within_5_years: data.shipped_within_5_years,
        gu_id: data.gu_id,
        gu_name: data.gu_name,
        region: data.region,
        business_unit: data.business_unit,
        installed_site_id: data.installed_site_id,
        installed_site_name: data.installed_site_name,
        installed_site_address_1: data.installed_site_address_1,
        installed_site_city: data.installed_site_city,
        installed_site_state: data.installed_site_state,
        installed_site_province: data.installed_site_province,
        installed_site_postal_code: data.installed_site_postal_code,
        installed_site_country: data.installed_site_country,
        covered_line_status: data.covered_line_status,
        coverage_status: data.coverage_status,
        contract_number: data.contract_number,
        contract_bill_to_name: data.contract_bill_to_name,
        contract_bill_to_country: data.contract_bill_to_country,
        service_level_description: data.service_level_description,
        service_level_category: data.service_level_category,
        product_coverage_line_number: data.product_coverage_line_number,
        covered_line_start_date: _.isNull(data.covered_line_start_date)
          ? null
          : moment(data.covered_line_start_date),
        covered_line_end_date: _.isNull(data.covered_line_end_date)
          ? null
          : moment(data.covered_line_end_date),
        expiration_range: data.expiration_range,
        termination_date: data.termination_date,
        last_date_of_support: _.isNull(data.last_date_of_support)
          ? null
          : moment(data.last_date_of_support),
        l_do_s_category: data.l_do_s_category,
        warranty_type: data.warranty_type,
        warranty_end_date: data.warranty_end_date,
        hardware_po_number: data.hardware_po_number,
        hardware_so_number: data.hardware_so_number,
        maintenance_po_number: data.maintenance_po_number,
        maintenance_so_number: data.maintenance_so_number,
        end_of_sale_date: data.end_of_sale_date,
        end_of_routine_failure_analysis_date: data.end_of_routine_failure_analysis_date,
        end_of_new_service_attachment_date: data.end_of_new_service_attachment_date,
        end_of_service_contract_renewal: data.end_of_service_contract_renewal,
        end_of_sig_releases_date: data.end_of_sig_releases_date,
        end_of_security_support_date: data.end_of_security_support_date,
        end_of_software_availability_date: data.end_of_software_availability_date,
        end_of_software_license_availability_date: data.end_of_software_license_availability_date,
        end_of_software_date: data.end_of_software_date,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoIB.save.messages.length > 0) {
      if (ciscoIB.save.hasErrors) {
        toast.error(ciscoIB.save.messages.join(' '));
      } else {
        toast.success(ciscoIB.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoIBMessages());
    }
  }, [ciscoIB.save.messages]);

  useEffect(() => {
    if (+id > 0 && ciscoIB.getById.data) {
      const data = ciscoIB.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoIB.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoIBById(+id));
    }
    return () => {
      dispatch(clearCiscoIBGetById());
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
        {ciscoIB.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoIB.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoIB"
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
                      loading={commonLookups.tenantLookup.loading}
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
                      loading={commonLookups.companyLookup.loading}
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
                      loading={commonLookups.buLookup.loading}
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
                  <label className="label">Customer Name</label>
                  <Form.Item
                    name="customer_name"
                    className="m-0"
                    label="Customer Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Asset ID</label>
                  <Form.Item name="asset_id" className="m-0" label="AssetID" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Unique Record</label>
                  <Form.Item
                    name="unique_record"
                    className="m-0"
                    label="Unique Record"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Duplicate Record</label>
                  <Form.Item
                    name="duplicate_record"
                    className="m-0"
                    label="Duplicate Record"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Duplicate Coverage</label>
                  <Form.Item
                    name="duplicate_coverage"
                    label="Duplicate Coverage"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Zone Assignment</label>
                  <Form.Item
                    name="zone_assignment"
                    label="Zone Assignment"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Zone Description</label>
                  <Form.Item
                    name="zone_description"
                    label="Zone Description"
                    className="m-0"
                    rules={[{ max: 40 }]}
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
                    label="Serial Number"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Instance Number</label>
                  <Form.Item
                    name="instance_number"
                    label="Instance Number"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Parent Serial Number</label>
                  <Form.Item
                    name="parent_serial_number"
                    label="Parent Serial Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Parent Instance Number</label>
                  <Form.Item
                    name="parent_instance_number"
                    label="Parent Instance Number"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Relationship</label>
                  <Form.Item
                    name="product_relationship"
                    label="Product Relationship"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product ID</label>
                  <Form.Item
                    name="product_id"
                    label="Product ID"
                    className="m-0"
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
                    label="Product Description"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Quantity</label>
                  <Form.Item
                    name="product_quantity"
                    label="Product Quantity"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Family</label>
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
                  <label className="label">Architecture Group</label>
                  <Form.Item
                    name="architecture_group"
                    label="Architecture Group"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Architecture Sub Group</label>
                  <Form.Item
                    name="architecture_sub_group"
                    label="Architecture Sub Group"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Item Type</label>
                  <Form.Item
                    name="item_type"
                    label="Item Type"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Network</label>
                  <Form.Item name="network" label="Network" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Base Status</label>
                  <Form.Item
                    name="installed_base_status"
                    label="Installed Base Status"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Serviceable</label>
                  <Form.Item
                    name="serviceable"
                    label="Serviceable"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Renewable</label>
                  <Form.Item
                    name="renewable"
                    label="Renewable"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Host Name</label>
                  <Form.Item
                    name="host_name"
                    label="Host Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hardware List Price</label>
                  <Form.Item
                    name="hardware_list_price"
                    label="Hardware List Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Maintenance List Price</label>
                  <Form.Item
                    name="maintenance_list_price"
                    label="Maintenance List Price"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Ship-To Customer Name</label>
                  <Form.Item
                    name="ship_to_customer_name"
                    label="Ship-To Customer Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Best Available Ship Date</label>
                  <Form.Item
                    name="best_available_ship_date"
                    label="Best AvailableShipDate"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Shipped Within 5 Years</label>
                  <Form.Item
                    name="shipped_within_5_years"
                    label="Shipped Within 5 Years"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">GU ID</label>
                  <Form.Item
                    name="gu_id"
                    label="GU ID"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">GU Name</label>
                  <Form.Item name="gu_name" label="GU Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Region</label>
                  <Form.Item name="region" label="Region" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Business Unit</label>
                  <Form.Item
                    name="business_unit"
                    label="Business Unit"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site ID</label>
                  <Form.Item
                    name="installed_site_id"
                    label="Installed Site ID"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site Name</label>
                  <Form.Item
                    name="installed_site_name"
                    label="Installed Site Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site Address 1</label>
                  <Form.Item
                    name="installed_site_address_1"
                    label="Installed Site Address 1"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site City</label>
                  <Form.Item
                    name="installed_site_city"
                    label="Installed Site City"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site State</label>
                  <Form.Item
                    name="installed_site_state"
                    label="Installed Site State"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site Province</label>
                  <Form.Item
                    name="installed_site_province"
                    label="Installed Site Province"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site Postal Code</label>
                  <Form.Item
                    name="installed_site_postal_code"
                    label="Installed Site Postal Code"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Installed Site Country</label>
                  <Form.Item
                    name="installed_site_country"
                    label="Installed Site Country"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Covered Line Status</label>
                  <Form.Item
                    name="covered_line_status"
                    label="Covered Line Status"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Coverage Status</label>
                  <Form.Item
                    name="coverage_status"
                    label="Coverage Status"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Contract Number</label>
                  <Form.Item
                    name="contract_number"
                    label="Contract Number"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Contract Bill-to Name</label>
                  <Form.Item
                    name="contract_bill_to_name"
                    label="Contract Bill-to Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Contract Bill-To Country</label>
                  <Form.Item
                    name="contract_bill_to_country"
                    label="Contract Bill-To Country"
                    className="m-0"
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
                    label="Service Level"
                    className="m-0"
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
                    label="Service Level Description"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Level Category</label>
                  <Form.Item
                    name="service_level_category"
                    label="Service Level Category"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Coverage Line Number</label>
                  <Form.Item
                    name="product_coverage_line_number"
                    label="Product Coverage Line Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Covered Line Start Date</label>
                  <Form.Item
                    name="covered_line_start_date"
                    label="Covered Line StartDate"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Covered End Start Date</label>
                  <Form.Item
                    name="covered_line_end_date"
                    label="Covered End StartDate"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Expiration Range</label>
                  <Form.Item
                    name="expiration_range"
                    label="Expiration Range"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Termination Date</label>
                  <Form.Item
                    name="termination_date"
                    label="Termination Date"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Date of Support</label>
                  <Form.Item name="last_date_of_support" label="Last DateofSupport" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">LDOS Category</label>
                  <Form.Item
                    name="l_do_s_category"
                    label="LDoS Category"
                    className="m-0"
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
                    label="Warranty Type"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Warranty End Date</label>
                  <Form.Item
                    name="warranty_end_date"
                    label="Warranty End Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hardware PO Number</label>
                  <Form.Item
                    name="hardware_po_number"
                    label="Hardware PO Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hardware SO Number</label>
                  <Form.Item
                    name="hardware_so_number"
                    label="Hardware SO Number"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Maintenance PO Number</label>
                  <Form.Item
                    name="maintenance_po_number"
                    label="Maintenance PO Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Maintenance SO Number</label>
                  <Form.Item
                    name="maintenance_so_number"
                    label="Maintenance SO Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Sale Date</label>
                  <Form.Item
                    name="end_of_sale_date"
                    label="End Of Sale Date"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Routine Failure Analysis Date</label>
                  <Form.Item
                    name="end_of_routine_failure_analysis_date"
                    label="End Of Routine Failure Analysis Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End of New Service Attachment Date</label>
                  <Form.Item
                    name="end_of_new_service_attachment_date"
                    label="End of New Service Attachment Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End of Service Contract Renewal</label>
                  <Form.Item
                    name="end_of_service_contract_renewal"
                    label="End of Service Contract Renewal"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Sig Releases Date</label>
                  <Form.Item
                    name="end_of_sig_releases_date"
                    label="End Of Sig Releases Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Security Support Date</label>
                  <Form.Item
                    name="end_of_security_support_date"
                    label="End Of Security Support Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Software Availability Date</label>
                  <Form.Item
                    name="end_of_software_availability_date"
                    label="End Of Software Availability Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Software License Availability Date</label>
                  <Form.Item
                    name="end_of_software_license_availability_date"
                    label="End Of Software License Availability Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Of Software Date</label>
                  <Form.Item
                    name="end_of_software_date"
                    label="End Of Software Date"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={ciscoIB.save.loading}>
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
export default AddCiscoIBModal;
