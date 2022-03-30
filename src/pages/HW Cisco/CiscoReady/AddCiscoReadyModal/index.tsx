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
import { ICiscoReady } from '../../../../services/hwCisco/ciscoReady/ciscoReady.model';
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
  saveCiscoReady,
  getCiscoReadyById,
} from '../../../../store/hwCisco/ciscoReady/ciscoReady.action';
import {
  ciscoReadySelector,
  clearCiscoReadyMessages,
  clearCiscoReadyGetById,
} from '../../../../store/hwCisco/ciscoReady/ciscoReady.reducer';
import { IAddCiscoReadyProps } from './addCiscoReady.model';

const { Option } = Select;

const AddCiscoReadyModal: React.FC<IAddCiscoReadyProps> = (props) => {
  const ciscoReady = useAppSelector(ciscoReadySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoReady} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoReady = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    source: '',
    serial_number_pak_number: '',
    coverage: '',
    covered_line_status: '',
    business_entity: '',
    sub_business_entity: '',
    product_family: '',
    product_id: '',
    product_description: '',
    asset_type: '',
    product_type: '',
    item_quantity: null,
    covered_line_start_date: null,
    covered_line_end_date: null,
    covered_line_end_date_fy_fq: '',
    contract_type: '',
    service_brand_code: '',
    contract_number: null,
    subscription_reference_id: '',
    ship_date: null,
    end_of_product_sale_date: '',
    end_of_software_maintenance_date: '',
    last_date_of_support: '',
    ldos_fy_fq: '',
    end_of_life_product_bulletin: '',
    warranty_type: '',
    warranty_end_date: '',
    install_site_customer_registry_gu_name: '',
    install_site_customer_registry_party_name: '',
    install_site_customer_registry_party_id: null,
    install_site_name: '',
    install_site_id: null,
    install_site_address_1: '',
    install_site_city: '',
    install_site_state: '',
    install_site_country: '',
    install_site_postal_code: null,
    product_bill_to_id: null,
    product_bill_to_partner_name: '',
    product_partner_be_geo_id: '',
    pos_partner_be_geo_id: null,
    pos_partner_be_geo_name: '',
    service_bill_to_id: null,
    service_bill_to_partner_name: '',
    service_partner_be_geo_id: '',
    product_list_price_$: null,
    default_service_list_price_$: null,
    default_service_level: '',
    existing_coverage_level_list_price_$: null,
    instance_id: '',
    parent_instance_id: null,
    product_so: '',
    product_po: '',
    service_so: '',
    service_po: '',
    web_order_id: '',
    mapped_to_swss: '',
    mapped_to_c1: '',
    auto_renewal_flag: '',
    configuration: null,
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoReady = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.covered_line_start_date = passDateToApi(inputValues.covered_line_start_date, true);
    inputValues.covered_line_end_date = passDateToApi(inputValues.covered_line_end_date, true);
    inputValues.ship_date = passDateToApi(inputValues.ship_date, true);
    inputValues.ship_date = passDateToApi(inputValues.ship_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (inputValues.mapped_to_swss) {
      inputValues.mapped_to_swss = 'Y';
    } else {
      inputValues.mapped_to_swss = 'N';
    }
    if (inputValues.mapped_to_c1) {
      inputValues.mapped_to_c1 = 'Y';
    } else {
      inputValues.mapped_to_c1 = 'N';
    }
    if (!isMultiple) {
      dispatch(saveCiscoReady(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoReady.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoReady) => {
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
        serial_number_pak_number: data.serial_number_pak_number,
        coverage: data.coverage,
        covered_line_status: data.covered_line_status,
        business_entity: data.business_entity,
        sub_business_entity: data.sub_business_entity,
        product_family: data.product_family,
        product_id: data.product_id,
        product_description: data.product_description,
        asset_type: data.asset_type,
        product_type: data.product_type,
        item_quantity: data.item_quantity,
        covered_line_start_date: _.isNull(data.covered_line_start_date)
          ? null
          : forEditModal(data.covered_line_start_date),
        covered_line_end_date: _.isNull(data.covered_line_end_date)
          ? null
          : forEditModal(data.covered_line_end_date),
        covered_line_end_date_fy_fq: data.covered_line_end_date_fy_fq,
        contract_type: data.contract_type,
        service_brand_code: data.service_brand_code,
        contract_number: data.contract_number,
        subscription_reference_id: data.subscription_reference_id,
        ship_date: _.isNull(data.ship_date) ? null : forEditModal(data.ship_date),
        end_of_product_sale_date: data.end_of_product_sale_date,
        end_of_software_maintenance_date: data.end_of_software_maintenance_date,
        last_date_of_support: data.last_date_of_support,
        ldos_fy_fq: data.ldos_fy_fq,
        end_of_life_product_bulletin: data.end_of_life_product_bulletin,
        warranty_type: data.warranty_type,
        warranty_end_date: data.warranty_end_date,
        install_site_customer_registry_gu_name: data.install_site_customer_registry_gu_name,
        install_site_customer_registry_party_name: data.install_site_customer_registry_party_name,
        install_site_customer_registry_party_id: data.install_site_customer_registry_party_id,
        install_site_name: data.install_site_name,
        install_site_id: data.install_site_id,
        install_site_address_1: data.install_site_address_1,
        install_site_city: data.install_site_city,
        install_site_state: data.install_site_state,
        install_site_country: data.install_site_country,
        install_site_postal_code: data.install_site_postal_code,
        product_bill_to_id: data.product_bill_to_id,
        product_bill_to_partner_name: data.product_bill_to_partner_name,
        product_partner_be_geo_id: data.product_partner_be_geo_id,
        pos_partner_be_geo_id: data.pos_partner_be_geo_id,
        pos_partner_be_geo_name: data.pos_partner_be_geo_name,
        service_bill_to_id: data.service_bill_to_id,
        service_bill_to_partner_name: data.service_bill_to_partner_name,
        service_partner_be_geo_id: data.service_partner_be_geo_id,
        product_list_price_$: data.product_list_price_$,
        default_service_list_price_$: data.default_service_list_price_$,
        default_service_level: data.default_service_level,
        existing_coverage_level_list_price_$: data.existing_coverage_level_list_price_$,
        instance_id: data.instance_id,
        parent_instance_id: data.parent_instance_id,
        product_so: data.product_so,
        product_po: data.product_po,
        service_so: data.service_so,
        service_po: data.service_po,
        web_order_id: data.web_order_id,
        mapped_to_swss: _.isEqual(data.mapped_to_swss, 'Y') ? true : false,
        mapped_to_c1: _.isEqual(data.mapped_to_c1, 'Y') ? true : false,
        auto_renewal_flag: data.auto_renewal_flag,
        configuration: data.configuration,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoReady.save.messages.length > 0) {
      if (ciscoReady.save.hasErrors) {
        toast.error(ciscoReady.save.messages.join(' '));
      } else {
        toast.success(ciscoReady.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoReadyMessages());
    }
  }, [ciscoReady.save.messages]);

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
    if (+id > 0 && ciscoReady.getById.data) {
      const data = ciscoReady.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoReady.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoReadyById(+id));
    }
    return () => {
      dispatch(clearCiscoReadyGetById());
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
        {ciscoReady.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoReady.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoReady"
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
                    <Form.Item
                      name={['checked', 'serial_number_pak_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Serial Number / PAK number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Serial Number / PAK number'
                  )}
                  <Form.Item
                    name="serial_number_pak_number"
                    className="m-0"
                    label="Serial Number / PAK number"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'coverage']} valuePropName="checked" noStyle>
                      <Checkbox>Coverage</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage'
                  )}
                  <Form.Item
                    name="coverage"
                    className="m-0"
                    label="Coverage"
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
                    className="m-0"
                    label="Covered Line Status"
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
                      name={['checked', 'business_entity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Business Entity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Business Entity'
                  )}
                  <Form.Item
                    name="business_entity"
                    className="m-0"
                    label="Business Entity"
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
                      name={['checked', 'sub_business_entity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Sub Business Entity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Sub Business Entity'
                  )}
                  <Form.Item
                    name="sub_business_entity"
                    className="m-0"
                    label="Sub Business Entity"
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
                    <Form.Item name={['checked', 'asset_type']} valuePropName="checked" noStyle>
                      <Checkbox>Asset Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Asset Type'
                  )}
                  <Form.Item
                    name="asset_type"
                    label="Asset Type"
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
                    <Form.Item name={['checked', 'product_type']} valuePropName="checked" noStyle>
                      <Checkbox>Product Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Type'
                  )}
                  <Form.Item
                    name="product_type"
                    label="Product Type"
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
                    <Form.Item name={['checked', 'item_quantity']} valuePropName="checked" noStyle>
                      <Checkbox>Item Quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Item Quantity'
                  )}
                  <Form.Item
                    name="item_quantity"
                    label="Item Quantity"
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
                    <DatePicker className="form-control w-100" />
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
                      <Checkbox>Covered Line End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Covered Line End Date'
                  )}
                  <Form.Item
                    name="covered_line_end_date"
                    label="Covered Line End Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'covered_line_end_date_fy_fq']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Covered Line End Date FY-FQ</Checkbox>
                    </Form.Item>
                  ) : (
                    'Covered Line End Date FY-FQ'
                  )}
                  <Form.Item
                    name="covered_line_end_date_fy_fq"
                    label="Covered Line End Date FY-FQ"
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
                    <Form.Item name={['checked', 'contract_type']} valuePropName="checked" noStyle>
                      <Checkbox>Contract Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Type'
                  )}
                  <Form.Item
                    name="contract_type"
                    label="Contract Type"
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
                      name={['checked', 'service_brand_code']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Brand Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Brand Code'
                  )}
                  <Form.Item
                    name="service_brand_code"
                    label="Service Brand Code"
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
                      name={['checked', 'subscription_reference_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Subscription Reference ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Subscription Reference ID'
                  )}
                  <Form.Item
                    name="subscription_reference_id"
                    label="Subscription Reference ID"
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
                    <Form.Item name={['checked', 'ship_date']} valuePropName="checked" noStyle>
                      <Checkbox>Ship Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ship Date'
                  )}
                  <Form.Item name="ship_date" label="Ship Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'end_of_product_sale_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End of Product Sale Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End of Product Sale Date'
                  )}
                  <Form.Item
                    name="end_of_product_sale_date"
                    label="End of Product Sale Date"
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
                      name={['checked', 'end_of_software_maintenance_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End of Software Maintenance Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End of Software Maintenance Date'
                  )}
                  <Form.Item
                    name="end_of_software_maintenance_date"
                    label="End of Software Maintenance Date"
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
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ldos_fy_fq']} valuePropName="checked" noStyle>
                      <Checkbox>LDOS FY-FQ</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDOS FY-FQ'
                  )}
                  <Form.Item
                    name="ldos_fy_fq"
                    label="LDOS FY-FQ"
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
                      name={['checked', 'end_of_life_product_bulletin']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>End Of Life Product Bulletin</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Of Life Product Bulletin'
                  )}
                  <Form.Item
                    name="end_of_life_product_bulletin"
                    label="End Of Life Product Bulletin"
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
                      name={['checked', 'install_site_customer_registry_gu_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Customer Registry GU Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Customer Registry GU Name'
                  )}
                  <Form.Item
                    name="install_site_customer_registry_gu_name"
                    label="Install Site Customer Registry GU Name"
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
                      name={['checked', 'install_site_customer_registry_party_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Customer Registry Party Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Customer Registry Party Name'
                  )}
                  <Form.Item
                    name="install_site_customer_registry_party_name"
                    label="Install Site Customer Registry Party Name"
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
                      name={['checked', 'install_site_customer_registry_party_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Customer Registry Party ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Customer Registry Party ID'
                  )}
                  <Form.Item
                    name="install_site_customer_registry_party_id"
                    label="Install Site Customer Registry Party ID"
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
                      name={['checked', 'install_site_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Name'
                  )}
                  <Form.Item
                    name="install_site_name"
                    label="Install Site Name"
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
                      name={['checked', 'install_site_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site ID'
                  )}
                  <Form.Item
                    name="install_site_id"
                    label="Install Site ID"
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
                      name={['checked', 'install_site_address_1']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Address 1</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Address 1'
                  )}
                  <Form.Item
                    name="install_site_address_1"
                    label="Install Site Address 1"
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
                      name={['checked', 'install_site_city']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site City</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site City'
                  )}
                  <Form.Item
                    name="install_site_city"
                    label="Install Site City"
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
                      name={['checked', 'install_site_state']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site State'
                  )}
                  <Form.Item
                    name="install_site_state"
                    label="Install Site State"
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
                      name={['checked', 'install_site_country']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Country'
                  )}
                  <Form.Item
                    name="install_site_country"
                    label="Install Site Country"
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
                      name={['checked', 'install_site_postal_code']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Site Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Site Postal Code'
                  )}
                  <Form.Item
                    name="install_site_postal_code"
                    label="Install Site Postal Code"
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
                      name={['checked', 'product_bill_to_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Bill to ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Bill to ID'
                  )}
                  <Form.Item
                    name="product_bill_to_id"
                    label="Product Bill to ID"
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
                      name={['checked', 'product_bill_to_partner_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Bill-to Partner Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Bill-to Partner Name'
                  )}
                  <Form.Item
                    name="product_bill_to_partner_name"
                    label="Product Bill-to Partner Name"
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
                      name={['checked', 'product_partner_be_geo_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Partner BE GEO ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Partner BE GEO ID'
                  )}
                  <Form.Item
                    name="product_partner_be_geo_id"
                    label="Product Partner BE GEO ID"
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
                      name={['checked', 'pos_partner_be_geo_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>POS Partner BE GEO ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'POS Partner BE GEO ID'
                  )}
                  <Form.Item
                    name="pos_partner_be_geo_id"
                    label="POS Partner BE GEO ID"
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
                      name={['checked', 'pos_partner_be_geo_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>POS Partner BE GEO Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'POS Partner BE GEO Name'
                  )}
                  <Form.Item
                    name="pos_partner_be_geo_name"
                    label="POS Partner BE GEO Name"
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
                      name={['checked', 'service_bill_to_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Bill to ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Bill to ID'
                  )}
                  <Form.Item
                    name="service_bill_to_id"
                    label="Service Bill to ID"
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
                      name={['checked', 'service_bill_to_partner_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Bill-to Partner Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Bill-to Partner Name'
                  )}
                  <Form.Item
                    name="service_bill_to_partner_name"
                    label="Service Bill-to Partner Name"
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
                      name={['checked', 'service_partner_be_geo_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Partner BE GEO ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Partner BE GEO ID'
                  )}
                  <Form.Item
                    name="service_partner_be_geo_id"
                    label="Service Partner BE GEO ID"
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
                      name={['checked', 'product_list_price_$']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product List Price $</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product List Price $'
                  )}
                  <Form.Item
                    name="product_list_price_$"
                    label="Product List Price $"
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
                      name={['checked', 'default_service_list_price_$']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Default Service List Price $</Checkbox>
                    </Form.Item>
                  ) : (
                    'Default Service List Price $'
                  )}
                  <Form.Item
                    name="default_service_list_price_$"
                    label="Default Service List Price $"
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
                      name={['checked', 'default_service_level']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Default Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Default Service Level'
                  )}
                  <Form.Item
                    name="default_service_level"
                    label="Default Service Level"
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
                      name={['checked', 'existing_coverage_level_list_price_$']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Existing Coverage Level List Price $</Checkbox>
                    </Form.Item>
                  ) : (
                    'Existing Coverage Level List Price $'
                  )}
                  <Form.Item
                    name="existing_coverage_level_list_price_$"
                    label="Existing Coverage Level List Price $"
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
                    <Form.Item name={['checked', 'instance_id']} valuePropName="checked" noStyle>
                      <Checkbox>Instance ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance ID'
                  )}
                  <Form.Item
                    name="instance_id"
                    label="Instance ID"
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
                    label="Parent Instance ID"
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
                    <Form.Item name={['checked', 'product_so']} valuePropName="checked" noStyle>
                      <Checkbox>Product SO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product SO'
                  )}
                  <Form.Item
                    name="product_so"
                    label="Product SO"
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
                    <Form.Item name={['checked', 'product_po']} valuePropName="checked" noStyle>
                      <Checkbox>Product PO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product PO'
                  )}
                  <Form.Item
                    name="product_po"
                    label="Product PO"
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
                    <Form.Item name={['checked', 'service_so']} valuePropName="checked" noStyle>
                      <Checkbox>Service SO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service SO'
                  )}
                  <Form.Item
                    name="service_so"
                    label="Service SO"
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
                    <Form.Item name={['checked', 'service_po']} valuePropName="checked" noStyle>
                      <Checkbox>Service PO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service PO'
                  )}
                  <Form.Item
                    name="service_po"
                    label="Service PO"
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
                    <Form.Item name={['checked', 'web_order_id']} valuePropName="checked" noStyle>
                      <Checkbox>Web Order ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Web Order ID'
                  )}
                  <Form.Item
                    name="web_order_id"
                    label="Web Order ID"
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
                      name={['checked', 'auto_renewal_flag']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Auto-renewal Flag</Checkbox>
                    </Form.Item>
                  ) : (
                    'Auto-renewal Flag'
                  )}
                  <Form.Item
                    name="auto_renewal_flag"
                    label="Auto-renewal Flag"
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
                    <Form.Item name={['checked', 'configuration']} valuePropName="checked" noStyle>
                      <Checkbox>Configuration</Checkbox>
                    </Form.Item>
                  ) : (
                    'Configuration'
                  )}
                  <Form.Item
                    name="configuration"
                    label="Configuration"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="mapped_to_swss" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'mapped_to_swss']} valuePropName="checked" noStyle>
                      <Checkbox>Mapped To SWSS</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mapped To SWSS'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="mapped_to_c1" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'mapped_to_c1']} valuePropName="checked" noStyle>
                      <Checkbox>Mapped To C1</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mapped To C1'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoReady.save.loading || commonLookups.save.loading}
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
export default AddCiscoReadyModal;
