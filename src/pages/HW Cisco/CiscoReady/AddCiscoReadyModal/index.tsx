import {
  Button,
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
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoReady } from '../../../../services/hwCisco/ciscoReady/ciscoReady.model';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
    date_added: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoReady = {
      ...values,
      id: id ? +id : null,
    };
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
    dispatch(saveCiscoReady(inputValues));
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
          : moment(data.covered_line_start_date),
        covered_line_end_date: _.isNull(data.covered_line_end_date)
          ? null
          : moment(data.covered_line_end_date),
        covered_line_end_date_fy_fq: data.covered_line_end_date_fy_fq,
        contract_type: data.contract_type,
        service_brand_code: data.service_brand_code,
        contract_number: data.contract_number,
        subscription_reference_id: data.subscription_reference_id,
        ship_date: _.isNull(data.ship_date) ? null : moment(data.ship_date),
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
        date_added: data.date_added,
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
                  <label className="label">Serial Number / PAK number</label>
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
                  <label className="label">Coverage</label>
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
                  <label className="label">Covered Line Status</label>
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
                  <label className="label">Business Entity</label>
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
                  <label className="label">Sub Business Entity</label>
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
                  <label className="label">Asset Type</label>
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
                  <label className="label">Product Type</label>
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
                  <label className="label">Item Quantity</label>
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
                  <label className="label">Covered Line Start Date</label>
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
                  <label className="label">Covered Line End Date</label>
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
                  <label className="label">Covered Line End Date FY-FQ</label>
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
                  <label className="label">Contract Type</label>
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
                  <label className="label">Service Brand Code</label>
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
                  <label className="label">Contract Number</label>
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
                  <label className="label">Subscription Reference ID</label>
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
                  <label className="label">Ship Date</label>
                  <Form.Item name="ship_date" label="Ship Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End of Product Sale Date</label>
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
                  <label className="label">End of Software Maintenance Date</label>
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
                  <label className="label">Last Date of Support</label>
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
                  <label className="label">LDOS FY-FQ</label>
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
                  <label className="label">End Of Life Product Bulletin</label>
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
                  <label className="label">Install Site Customer Registry GU Name</label>
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
                  <label className="label">Install Site Customer Registry Party Name</label>
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
                  <label className="label">Install Site Customer Registry Party ID</label>
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
                  <label className="label">Install Site Name</label>
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
                  <label className="label">Install Site ID</label>
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
                  <label className="label">Install Site Address 1</label>
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
                  <label className="label">Install Site City</label>
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
                  <label className="label">Install Site State</label>
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
                  <label className="label">Install Site Country</label>
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
                  <label className="label">Install Site Postal Code</label>
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
                  <label className="label">Product Bill to ID</label>
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
                  <label className="label">Product Bill-to Partner Name</label>
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
                  <label className="label">Product Partner BE GEO ID</label>
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
                  <label className="label">POS Partner BE GEO ID</label>
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
                  <label className="label">POS Partner BE GEO Name</label>
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
                  <label className="label">Service Bill to ID</label>
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
                  <label className="label">Service Bill to Partner Name</label>
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
                  <label className="label">Service Partner BE GEO ID</label>
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
                  <label className="label">Product List Price $</label>
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
                  <label className="label">Default Service List Price $</label>
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
                  <label className="label">Default Service Level</label>
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
                  <label className="label">Existing Coverage Level List Price $</label>
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
                  <label className="label">Instance ID</label>
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
                  <label className="label">Parent Instance ID</label>
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
                  <label className="label">Product SO</label>
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
                  <label className="label">Product PO</label>
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
                  <label className="label">Service SO</label>
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
                  <label className="label">Service PO</label>
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
                  <label className="label">Web Order ID</label>
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
                  <label className="label">Auto Renewal flag</label>
                  <Form.Item
                    name="auto_renewal_flag"
                    label="Auto-renewal flag"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Configuration</label>
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
                  <label className="label">Mapped to SWSS (Y/N)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="mapped_to_c1" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Mapped to C1 (Y/N)</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoReady.save.loading}
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
