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
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../../services/common/common.model';
import { IAzureDailyUsage } from '../../../../services/azure/azureDailyUsage/azureDailyUsage.model';
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
  getAzureDailyUsageById,
  saveAzureDailyUsage,
} from '../../../../store/azure/azureDailyUsage/azureDailyUsage.action';
import {
  clearAzureDailyUsageGetById,
  clearAzureDailyUsageMessages,
  azureDailyUsageSelector,
} from '../../../../store/azure/azureDailyUsage/azureDailyUsage.reducer';
import { IAddAzureDailyUsageProps } from './addAzureDailyUsage.model';
import moment from 'moment';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';

const { Option } = Select;

const AddAzureDailyUsageModal: React.FC<IAddAzureDailyUsageProps> = (props) => {
  const azureDailyUsage = useAppSelector(azureDailyUsageSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.AzureDailyUsage} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAzureDailyUsage = {
    company_id: null,
    bu_id: null,
    account_owner_id: '',
    account_name: '',
    service_administrator_id: '',
    subscription_id: '',
    subscription_guid: '',
    subscription_name: '',
    date: null,
    month: null,
    day: null,
    year: null,
    product: '',
    meter_id: '',
    meter_category: '',
    meter_sub_category: '',
    meter_region: '',
    meter_name: '',
    consumed_quantity: null,
    resource_rate: null,
    extended_cost: null,
    resource_location: '',
    consumed_service: '',
    instance_id: '',
    service_info1: '',
    service_info2: '',
    additional_info: '',
    tags: '',
    store_service_identifier: '',
    department_name: '',
    cost_center: '',
    unit_of_measure: '',
    resource_group: '',
    charges_billed_separately: false,
    billing_currency: '',
    offer_id: '',
    is_azure_credit_eligible: false,
    billing_account_id: '',
    billing_account_name: '',
    billing_period_start_date: null,
    billing_period_end_date: null,
    billing_profile_id: '',
    billing_profile_name: '',
    part_number: '',
    service_family: '',
    unit_price: null,
    availability_zone: '',
    resource_name: '',
    invoice_section_id: '',
    invoice_section: '',
    reservation_id: '',
    reservation_name: '',
    product_order_id: '',
    product_order_name: '',
    term: null,
    publisher_name: '',
    plan_name: '',
    charge_type: '',
    frequency: '',
    publisher_type: '',
    pay_g_price: null,
    pricing_model: '',
    idle: false,
    idle_est_savings: null,
    placement: false,
    placement_est_savings: null,
    vm_instance_id: '',
    vm_resource_name: '',
    ri_applied: false,
    ri_suggested: false,
    ri_est_savings: null,
    ahb_applied: false,
    ahb_suggested: false,
    ahb_est_savings: null,
    dev_test_applied: false,
    dev_test_suggested: false,
    dev_test_est_savings: null,
    resource_rate_list: null,
    discount: null,
    rate_card_unit: '',
    usage: null,
    growth: null,
    month_name: '',
    tenant_id: null,
  };

  const onFinish = (values: IAzureDailyUsage) => {
    const inputValues: IAzureDailyUsage = {
      ...values,
      resource_rate: Number(values.resource_rate),
      extended_cost: Number(values.extended_cost),
      id: id ? +id : null,
    };
    dispatch(saveAzureDailyUsage(inputValues));
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

  const fillValuesOnEdit = async (data: IAzureDailyUsage) => {
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
        account_owner_id: data.account_owner_id,
        account_name: data.account_name,
        service_administrator_id: data.service_administrator_id,
        subscription_id: data.subscription_id,
        subscription_guid: data.subscription_guid,
        subscription_name: data.subscription_name,
        date: _.isNull(data.date) ? null : moment(data.date),
        month: data.month,
        day: data.day,
        year: data.year,
        product: data.product,
        meter_id: data.meter_id,
        meter_category: data.meter_category,
        meter_sub_category: data.meter_sub_category,
        meter_region: data.meter_region,
        meter_name: data.meter_name,
        consumed_quantity: data.consumed_quantity,
        resource_rate: data.resource_rate,
        extended_cost: data.extended_cost,
        resource_location: data.resource_location,
        consumed_service: data.consumed_service,
        instance_id: data.instance_id,
        service_info1: data.service_info1,
        service_info2: data.service_info2,
        additional_info: data.additional_info,
        tags: data.tags,
        store_service_identifier: data.store_service_identifier,
        department_name: data.department_name,
        cost_center: data.cost_center,
        unit_of_measure: data.unit_of_measure,
        resource_group: data.resource_group,
        charges_billed_separately: data.charges_billed_separately,
        billing_currency: data.billing_currency,
        offer_id: data.offer_id,
        is_azure_credit_eligible: data.is_azure_credit_eligible,
        billing_account_id: data.billing_account_id,
        billing_account_name: data.billing_account_name,
        billing_period_start_date: _.isNull(data.billing_period_start_date)
          ? null
          : moment(data.billing_period_start_date),
        billing_period_end_date: _.isNull(data.billing_period_end_date)
          ? null
          : moment(data.billing_period_end_date),
        billing_profile_id: data.billing_profile_id,
        billing_profile_name: data.billing_profile_name,
        part_number: data.part_number,
        service_family: data.service_family,
        unit_price: data.unit_price,
        availability_zone: data.availability_zone,
        resource_name: data.resource_name,
        invoice_section_id: data.invoice_section_id,
        invoice_section: data.invoice_section,
        reservation_id: data.reservation_id,
        reservation_name: data.reservation_name,
        product_order_id: data.product_order_id,
        product_order_name: data.product_order_name,
        term: data.term,
        publisher_name: data.publisher_name,
        plan_name: data.plan_name,
        charge_type: data.charge_type,
        frequency: data.frequency,
        publisher_type: data.publisher_type,
        pay_g_price: data.pay_g_price,
        pricing_model: data.pricing_model,
        idle: data.idle,
        idle_est_savings: data.idle_est_savings,
        placement: data.placement,
        placement_est_savings: data.placement_est_savings,
        vm_instance_id: data.vm_instance_id,
        vm_resource_name: data.vm_resource_name,
        ri_applied: data.ri_applied,
        ri_suggested: data.ri_suggested,
        ri_est_savings: data.ri_est_savings,
        ahb_applied: data.ahb_applied,
        ahb_suggested: data.ahb_suggested,
        ahb_est_savings: data.ahb_est_savings,
        dev_test_applied: data.dev_test_applied,
        dev_test_suggested: data.dev_test_suggested,
        dev_test_est_savings: data.dev_test_est_savings,
        resource_rate_list: data.resource_rate_list,
        discount: data.discount,
        rate_card_unit: data.rate_card_unit,
        usage: data.usage,
        growth: data.growth,
        month_name: data.month_name,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (azureDailyUsage.save.messages.length > 0) {
      if (azureDailyUsage.save.hasErrors) {
        toast.error(azureDailyUsage.save.messages.join(' '));
      } else {
        toast.success(azureDailyUsage.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAzureDailyUsageMessages());
    }
  }, [azureDailyUsage.save.messages]);

  useEffect(() => {
    if (+id > 0 && azureDailyUsage.getById.data) {
      const data = azureDailyUsage.getById.data;
      fillValuesOnEdit(data);
    }
  }, [azureDailyUsage.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getAzureDailyUsageById(+id));
    }
    return () => {
      dispatch(clearAzureDailyUsageGetById());
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
        {azureDailyUsage.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={azureDailyUsage.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAzureDailyUsage"
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
                  <label className="label">Account OwnerId</label>
                  <Form.Item
                    name="account_owner_id"
                    className="m-0"
                    label="Account OwnerId"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Account Name</label>
                  <Form.Item
                    name="account_name"
                    label="Account name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Administrator Id</label>
                  <Form.Item
                    name="service_administrator_id"
                    label="Service Administrator Id"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SubscriptionId</label>
                  <Form.Item
                    name="subscription_id"
                    label="SubscriptionId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Subscription GUId</label>
                  <Form.Item
                    name="subscription_guid"
                    label="Subscription GUId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Subscription Name</label>
                  <Form.Item
                    name="subscription_name"
                    label="Subscription name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Date</label>
                  <Form.Item name="date" label="Date" className="m-0">
                    <DatePicker
                      className="form-control w-100"
                      onChange={(value) => {
                        form.setFieldsValue({
                          day: Number(moment(value).format('D')),
                          month: Number(moment(value).format('M')),
                          month_name: value ? moment(value).format('MMMM') : '',
                          year: Number(moment(value).format('YYYY')),
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Day</label>
                  <Form.Item name="day" label="Day" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber min={1} max={31} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Month</label>
                  <Form.Item
                    name="month"
                    label="Month"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={1} max={12} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Month Name</label>
                  <Form.Item
                    name="month_name"
                    label="Month Name"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Year</label>
                  <Form.Item name="year" label="Year" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product</label>
                  <Form.Item name="product" className="m-0" label="Product" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">MeterId</label>
                  <Form.Item name="meter_id" label="MeterId" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Category</label>
                  <Form.Item
                    name="meter_category"
                    label="Meter Category"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Sub-Category</label>
                  <Form.Item
                    name="meter_sub_category"
                    label="Meter Sub-Category"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Region</label>
                  <Form.Item
                    name="meter_region"
                    label="Meter Region"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Name</label>
                  <Form.Item
                    name="meter_name"
                    label="Meter name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Consumed Quantity</label>
                  <Form.Item
                    name="consumed_quantity"
                    label="Consumed Quantity"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Resource Rate</label>
                  <Form.Item
                    name="resource_rate"
                    label="Resource Rate"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Extended Cost</label>
                  <Form.Item
                    name="extended_cost"
                    label="Extended Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Resource Location</label>
                  <Form.Item
                    name="resource_location"
                    label="Resource Location"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Consumed Service</label>
                  <Form.Item
                    name="consumed_service"
                    label="Consumed Service"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">InstanceId</label>
                  <Form.Item name="instance_id" label="InstanceId" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Info1</label>
                  <Form.Item
                    name="service_info1"
                    label="Service Info1"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Info2</label>
                  <Form.Item
                    name="service_info2"
                    label="Service Info2"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Additional Info</label>
                  <Form.Item name="additional_info" label="Additional Info" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tags</label>
                  <Form.Item name="tags" label="Tags" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Store Service Identifier</label>
                  <Form.Item
                    name="store_service_identifier"
                    label="Store Service Identifier"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Department Name</label>
                  <Form.Item
                    name="department_name"
                    label="Department Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cost Center</label>
                  <Form.Item
                    name="cost_center"
                    label="Cost Center"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Unit Of Measure</label>
                  <Form.Item
                    name="unit_of_measure"
                    label="Unit Of Measure"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Resource Group</label>
                  <Form.Item
                    name="resource_group"
                    label="Resource Group"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing Currency</label>
                  <Form.Item
                    name="billing_currency"
                    label="Billing Currency"
                    className="m-0"
                    rules={[{ max: 20 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">OfferId</label>
                  <Form.Item name="offer_id" label="OfferId" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing AccountId</label>
                  <Form.Item
                    name="billing_account_id"
                    label="Billing AccountId"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing Account Name</label>
                  <Form.Item
                    name="billing_account_name"
                    label="Billing Account Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing Period Start Date</label>
                  <Form.Item
                    name="billing_period_start_date"
                    label="Billing Period Start Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing Period End Date</label>
                  <Form.Item
                    name="billing_period_end_date"
                    label="Billing Period End Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing ProfileId</label>
                  <Form.Item
                    name="billing_profile_id"
                    label="Billing ProfileId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Billing Profile Name</label>
                  <Form.Item
                    name="billing_profile_name"
                    label="Billing Profile Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Part Number</label>
                  <Form.Item
                    name="part_number"
                    label="Part number"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Family</label>
                  <Form.Item
                    name="service_family"
                    label="Service Family"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Unit Price</label>
                  <Form.Item
                    name="unit_price"
                    label="Unit Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Availability Zone</label>
                  <Form.Item
                    name="availability_zone"
                    label="Availability Zone"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Resource Name</label>
                  <Form.Item
                    name="resource_name"
                    label="Resource Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Invoice SectionId</label>
                  <Form.Item
                    name="invoice_section_id"
                    label="Invoice SectionId"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Invoice Section</label>
                  <Form.Item
                    name="invoice_section"
                    label="Invoice Section"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Reservation Id</label>
                  <Form.Item
                    name="reservation_id"
                    label="Reservation Id"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Reservation Name</label>
                  <Form.Item
                    name="reservation_name"
                    label="Reservation Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product OrderId</label>
                  <Form.Item
                    name="product_order_id"
                    label="Product OrderId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Order Name</label>
                  <Form.Item
                    name="product_order_name"
                    label="Product Order Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Term</label>
                  <Form.Item name="term" label="Term" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Publisher Name</label>
                  <Form.Item
                    name="publisher_name"
                    label="Publisher Name"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Plan Name</label>
                  <Form.Item
                    name="plan_name"
                    label="Plan Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Charge Type</label>
                  <Form.Item
                    name="charge_type"
                    label="Charge Type"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Frequency</label>
                  <Form.Item
                    name="frequency"
                    label="Frequency"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Publisher Type</label>
                  <Form.Item
                    name="publisher_type"
                    label="Publisher Type"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">PayGPrice</label>
                  <Form.Item
                    name="pay_g_price"
                    label="PayGPrice"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Pricing Model</label>
                  <Form.Item
                    name="pricing_model"
                    label="Pricing Model"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Idle - EST Savings</label>
                  <Form.Item
                    name="idle_est_savings"
                    label="Idle - EST Savings"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Placement - EST Savings</label>
                  <Form.Item
                    name="placement_est_savings"
                    label="Placement - EST Savings"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">VM - Resource Name</label>
                  <Form.Item
                    name="vm_resource_name"
                    label="VM - Resource Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">RI - Est Savings</label>
                  <Form.Item
                    name="ri_est_savings"
                    label="RI - Est Savings"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">AHB - Est Savings</label>
                  <Form.Item
                    name="ahb_est_savings"
                    label="AHB - Est Savings"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">DevTest - Est Savings</label>
                  <Form.Item
                    name="dev_test_est_savings"
                    label="DevTest - Est Savings"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">ResourceRate - List</label>
                  <Form.Item
                    name="resource_rate_list"
                    label="ResourceRate - List"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Discount</label>
                  <Form.Item
                    name="discount"
                    label="Discount"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Rate Card Unit</label>
                  <Form.Item
                    name="rate_card_unit"
                    label="Rate Card Unit"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Usage %</label>
                  <Form.Item
                    name="usage"
                    label="Usage"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" min={0} max={100} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Growth %</label>
                  <Form.Item
                    name="growth"
                    label="Growth"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" min={0} max={100} />
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="charges_billed_separately"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Charges Billed Separately</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_azure_credit_eligible"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Azure Credit Eligible</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="idle" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Idle</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="placement" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Placement</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ri_applied" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">RI - Applied</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ri_suggested" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">RI - Suggested</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ahb_applied" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">AHB - Applied</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ahb_suggested" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">AHB - Suggested</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dev_test_applied" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">DevTest - Applied</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dev_test_suggested" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">DevTest - Suggested</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={azureDailyUsage.save.loading}
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
export default AddAzureDailyUsageModal;
