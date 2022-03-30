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
import { ICiscoIB } from '../../../../services/hwCisco/ciscoIB/ciscoIB.model';
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
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    best_available_ship_date: null,
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
    covered_line_start_date: null,
    covered_line_end_date: null,
    expiration_range: '',
    termination_date: null,
    last_date_of_support: null,
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
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoIB = {
      ...values,
      id: id ? +id : null,
      best_available_ship_date:
        values.best_available_ship_date === '' ? null : values.best_available_ship_date,
      covered_line_start_date:
        values.covered_line_start_date === '' ? null : values.covered_line_start_date,
      covered_line_end_date:
        values.covered_line_end_date === '' ? null : values.covered_line_end_date,
      last_date_of_support: values.last_date_of_support === '' ? null : values.last_date_of_support,
    };
    inputValues.best_available_ship_date = passDateToApi(
      inputValues.best_available_ship_date,
      true
    );
    inputValues.covered_line_start_date = passDateToApi(inputValues.covered_line_start_date, true);
    inputValues.covered_line_end_date = passDateToApi(inputValues.covered_line_end_date, true);
    inputValues.last_date_of_support = passDateToApi(inputValues.last_date_of_support, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoIB(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoIB.search.tableName
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
          : forEditModal(data.best_available_ship_date),
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
          : forEditModal(data.covered_line_start_date),
        covered_line_end_date: _.isNull(data.covered_line_end_date)
          ? null
          : forEditModal(data.covered_line_end_date),
        expiration_range: data.expiration_range,
        termination_date: data.termination_date,
        last_date_of_support: _.isNull(data.last_date_of_support)
          ? null
          : forEditModal(data.last_date_of_support),
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
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
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
                    <Form.Item name={['checked', 'customer_name']} valuePropName="checked" noStyle>
                      <Checkbox>Customer Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Customer Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'asset_id']} valuePropName="checked" noStyle>
                      <Checkbox>Asset ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Asset ID'
                  )}
                  <Form.Item
                    name="asset_id"
                    className="m-0"
                    label="Asset ID"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'unique_record']} valuePropName="checked" noStyle>
                      <Checkbox>Unique Record</Checkbox>
                    </Form.Item>
                  ) : (
                    'Unique Record'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'duplicate_record']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Duplicate Record</Checkbox>
                    </Form.Item>
                  ) : (
                    'Duplicate Record'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'duplicate_coverage']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Duplicate Coverage</Checkbox>
                    </Form.Item>
                  ) : (
                    'Duplicate Coverage'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'zone_assignment']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Zone Assignment</Checkbox>
                    </Form.Item>
                  ) : (
                    'Zone Assignment'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'zone_description']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Zone Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Zone Description'
                  )}
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
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'instance_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Instance Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_serial_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Serial Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Serial Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_instance_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Instance Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Instance Number'
                  )}
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
                      name={['checked', 'product_relationship']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Relationship</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Relationship'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_quantity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Quantity'
                  )}
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
                    <Form.Item
                      name={['checked', 'architecture_group']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Architecture Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Architecture Group'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'architecture_sub_group']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Architecture Sub Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Architecture Sub Group'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'item_type']} valuePropName="checked" noStyle>
                      <Checkbox>Item Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Item Type'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'network']} valuePropName="checked" noStyle>
                      <Checkbox>Network</Checkbox>
                    </Form.Item>
                  ) : (
                    'Network'
                  )}
                  <Form.Item name="network" label="Network" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_base_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Base Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Base Status'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'serviceable']} valuePropName="checked" noStyle>
                      <Checkbox>Serviceable</Checkbox>
                    </Form.Item>
                  ) : (
                    'Serviceable'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'renewable']} valuePropName="checked" noStyle>
                      <Checkbox>Renewable</Checkbox>
                    </Form.Item>
                  ) : (
                    'Renewable'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'host_name']} valuePropName="checked" noStyle>
                      <Checkbox>Host Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hardware_list_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hardware List Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hardware List Price'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'maintenance_list_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Maintenance List Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance List Price'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'ship_to_customer_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Ship-To Customer Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ship-To Customer Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'best_available_ship_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Best Available ShipDate</Checkbox>
                    </Form.Item>
                  ) : (
                    'Best Available ShipDate'
                  )}
                  <Form.Item
                    name="best_available_ship_date"
                    label="Best Available ShipDate"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'shipped_within_5_years']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Shipped Within 5 Years</Checkbox>
                    </Form.Item>
                  ) : (
                    'Shipped Within 5 Years'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'gu_id']} valuePropName="checked" noStyle>
                      <Checkbox>GU ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'GU ID'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'gu_name']} valuePropName="checked" noStyle>
                      <Checkbox>GU Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'GU Name'
                  )}
                  <Form.Item name="gu_name" label="GU Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'region']} valuePropName="checked" noStyle>
                      <Checkbox>Region</Checkbox>
                    </Form.Item>
                  ) : (
                    'Region'
                  )}
                  <Form.Item name="region" label="Region" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'business_unit']} valuePropName="checked" noStyle>
                      <Checkbox>Business Unit</Checkbox>
                    </Form.Item>
                  ) : (
                    'Business Unit'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site ID'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_address_1']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site Address 1</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site Address 1'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_city']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site City</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site City'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_state']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site State'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_province']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site Province</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site Province'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_postal_code']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site Postal Code'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_site_country']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed Site Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Site Country'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'covered_line_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Covered Line Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Covered Line Status'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'coverage_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Status'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'contract_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contract Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'contract_bill_to_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contract Bill-to Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Bill-to Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'contract_bill_to_country']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contract Bill-To Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Bill-To Country'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_level']} valuePropName="checked" noStyle>
                      <Checkbox>Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'service_level_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Level Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level Category'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_coverage_line_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Coverage Line Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Coverage Line Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'covered_line_start_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Covered Line Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Covered Line Start Date'
                  )}
                  <Form.Item
                    name="covered_line_start_date"
                    label="Covered Line Start Date"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'covered_line_end_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Covered End Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Covered End Start Date'
                  )}
                  <Form.Item
                    name="covered_line_end_date"
                    label="Covered End Start Date"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'expiration_range']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Expiration Range</Checkbox>
                    </Form.Item>
                  ) : (
                    'Expiration Range'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'termination_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Termination Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Termination Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_date_of_support']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Date of Support</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Date of Support'
                  )}
                  <Form.Item
                    name="last_date_of_support"
                    label="Last Date of Support"
                    className="m-0"
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'l_do_s_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>LDoS Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDoS Category'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warranty_type']} valuePropName="checked" noStyle>
                      <Checkbox>Warranty Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty Type'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'warranty_end_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Warranty End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty End Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hardware_po_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hardware PO Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hardware PO Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hardware_so_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hardware SO Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hardware SO Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'maintenance_po_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Maintenance PO Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance PO Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'maintenance_so_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Maintenance SO Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance SO Number'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_sale_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Sale Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Sale Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_routine_failure_analysis_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Routine Failure Analysis Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Routine Failure Analysis Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_new_service_attachment_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End of New Service Attachment Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End of New Service Attachment Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_service_contract_renewal']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End of Service Contract Renewal</Checkbox>
                    </Form.Item>
                  ) : (
                    'End of Service Contract Renewal'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_sig_releases_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Sig Releases Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Sig Releases Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_security_support_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Security Support Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Security Support Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_software_availability_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Software Availability Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Software Availability Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_software_license_availability_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Software License Availability Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Software License Availability Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_software_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Software Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Software Date'
                  )}
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
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoIB.save.loading || commonLookups.save.loading}
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
export default AddCiscoIBModal;
