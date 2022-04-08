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
import { ILookup } from '../../../../services/common/common.model';
import { IAzureDailyUsage } from '../../../../services/azure/azureDailyUsage/azureDailyUsage.model';
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
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddAzureDailyUsageModal: React.FC<IAddAzureDailyUsageProps> = (props) => {
  const azureDailyUsage = useAppSelector(azureDailyUsageSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    meterSubCategory: '',
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
    date_added: getSimpleDate(),
    product_id: '',
    resource_group_name: '',
    resource_id: '',
    location: '',
    effective_price: null,
    quantity: null,
    pricing_currency: '',
    cost_in_billing_currency: null,
    cost_in_pricing_currency: null,
    cost_in_usd: null,
    payg_cost_in_billing_currency: null,
    payg_cost_in_usd: null,
    exchange_rate_pricing_to_billing: null,
    exchange_rate_date: null,
    cost: null,
    environment: '',
    environment_tags: '',
    dev_test_eligible: false,
  };

  const onFinish = (values: IAzureDailyUsage) => {
    const inputValues: IAzureDailyUsage = {
      ...values,
      resource_rate: Number(values.resource_rate),
      extended_cost: Number(values.extended_cost),
      id: id ? +id : null,
    };
    inputValues.date = passDateToApi(inputValues.date, true);
    inputValues.billing_period_start_date = passDateToApi(
      inputValues.billing_period_start_date,
      true
    );
    inputValues.billing_period_end_date = passDateToApi(inputValues.billing_period_end_date, true);
    inputValues.exchange_rate_date = passDateToApi(inputValues.exchange_rate_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveAzureDailyUsage(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        azureDailyUsage.search.tableName
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
        date: _.isNull(data.date) ? null : forEditModal(data.date),
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
        meterSubCategory: data.meterSubCategory,
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
          : forEditModal(data.billing_period_start_date),
        billing_period_end_date: _.isNull(data.billing_period_end_date)
          ? null
          : forEditModal(data.billing_period_end_date),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
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
        product_id: data.product_id,
        resource_group_name: data.resource_group_name,
        resource_id: data.resource_id,
        location: data.location,
        effective_price: _.isNull(data.effective_price) ? null : data.effective_price,
        quantity: _.isNull(data.quantity) ? null : data.quantity,
        pricing_currency: data.environment,
        cost_in_billing_currency: _.isNull(data.cost_in_billing_currency)
          ? null
          : data.cost_in_billing_currency,
        cost_in_pricing_currency: _.isNull(data.cost_in_pricing_currency)
          ? null
          : data.cost_in_pricing_currency,
        cost_in_usd: _.isNull(data.cost_in_usd) ? null : data.cost_in_usd,
        payg_cost_in_billing_currency: _.isNull(data.bu_id) ? null : data.bu_id,
        payg_cost_in_usd: _.isNull(data.payg_cost_in_usd) ? null : data.payg_cost_in_usd,
        exchange_rate_pricing_to_billing: _.isNull(data.exchange_rate_pricing_to_billing)
          ? null
          : data.exchange_rate_pricing_to_billing,
        exchange_rate_date: _.isNull(data.exchange_rate_date)
          ? null
          : forEditModal(data.exchange_rate_date),
        cost: _.isNull(data.cost) ? null : data.cost,
        environment: data.environment,
        environment_tags: data.environment_tags,
        dev_test_eligible: data.dev_test_eligible,
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
    if (+id > 0 && azureDailyUsage.getById.data) {
      const data = azureDailyUsage.getById.data;
      fillValuesOnEdit(data);
    }
  }, [azureDailyUsage.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getAzureDailyUsageById(+id));
    }
    return () => {
      dispatch(clearAzureDailyUsageGetById());
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
                      name={['checked', 'account_owner_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Account OwnerId</Checkbox>
                    </Form.Item>
                  ) : (
                    'Account OwnerId'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'account_name']} valuePropName="checked" noStyle>
                      <Checkbox>Account Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Account Name'
                  )}
                  <Form.Item
                    name="account_name"
                    label="Account Name"
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
                      name={['checked', 'service_administrator_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Administrator Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Administrator Id'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'subscription_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Subscription Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Subscription Id'
                  )}
                  <Form.Item
                    name="subscription_id"
                    label="Subscription Id"
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
                      name={['checked', 'subscription_guid']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Subscription GUId</Checkbox>
                    </Form.Item>
                  ) : (
                    'Subscription GUId'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'subscription_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Subscription Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Subscription Name'
                  )}
                  <Form.Item
                    name="subscription_name"
                    label="Subscription Name"
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
                    <Form.Item name={['checked', 'date']} valuePropName="checked" noStyle>
                      <Checkbox>Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date'
                  )}
                  <Form.Item name="date" label="Date" className="m-0">
                    <DatePicker
                      className="form-control w-100"
                      onChange={(value) => {
                        form.setFieldsValue({
                          day: Number(forEditModal(value).format('D')),
                          month: Number(forEditModal(value).format('M')),
                          month_name: value ? forEditModal(value).format('MMMM') : '',
                          year: Number(forEditModal(value).format('YYYY')),
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'meterSubCategory']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>meterSubCategory</Checkbox>
                    </Form.Item>
                  ) : (
                    'meterSubCategory'
                  )}
                  <Form.Item
                    name="meterSubCategory"
                    label="meterSubCategory"
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
                    <Form.Item name={['checked', 'day']} valuePropName="checked" noStyle>
                      <Checkbox>Day</Checkbox>
                    </Form.Item>
                  ) : (
                    'Day'
                  )}
                  <Form.Item name="day" label="Day" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber min={1} max={31} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'month']} valuePropName="checked" noStyle>
                      <Checkbox>Month</Checkbox>
                    </Form.Item>
                  ) : (
                    'Month'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'month_name']} valuePropName="checked" noStyle>
                      <Checkbox>Month Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Month Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'year']} valuePropName="checked" noStyle>
                      <Checkbox>Year</Checkbox>
                    </Form.Item>
                  ) : (
                    'Year'
                  )}
                  <Form.Item name="year" label="Year" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product']} valuePropName="checked" noStyle>
                      <Checkbox>Product</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product'
                  )}
                  <Form.Item name="product" className="m-0" label="Product" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_id']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Id'
                  )}
                  <Form.Item
                    name="meter_id"
                    label="Meter Id"
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
                    <Form.Item name={['checked', 'meter_category']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Category'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'meter_sub_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Meter Sub-Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Sub-Category'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_region']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Region</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Region'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_name']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Name'
                  )}
                  <Form.Item
                    name="meter_name"
                    label="Meter Name"
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
                      name={['checked', 'consumed_quantity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Consumed Quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Consumed Quantity'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'resource_rate']} valuePropName="checked" noStyle>
                      <Checkbox>Resource Rate</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Rate'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'extended_cost']} valuePropName="checked" noStyle>
                      <Checkbox>Extended Cost</Checkbox>
                    </Form.Item>
                  ) : (
                    'Extended Cost'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'resource_location']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Resource Location</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Location'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'consumed_service']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Consumed Service</Checkbox>
                    </Form.Item>
                  ) : (
                    'Consumed Service'
                  )}
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
                    <Form.Item name={['checked', 'instance_id']} valuePropName="checked" noStyle>
                      <Checkbox>Instance Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance Id'
                  )}
                  <Form.Item name="instance_id" label="Instance Id" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_info1']} valuePropName="checked" noStyle>
                      <Checkbox>Service Info1</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Info1'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_info2']} valuePropName="checked" noStyle>
                      <Checkbox>Service Info2</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Info2'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'additional_info']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Additional Info</Checkbox>
                    </Form.Item>
                  ) : (
                    'Additional Info'
                  )}
                  <Form.Item name="additional_info" label="Additional Info" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'tags']} valuePropName="checked" noStyle>
                      <Checkbox>Tags</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tags'
                  )}
                  <Form.Item name="tags" label="Tags" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'store_service_identifier']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Store Service Identifier</Checkbox>
                    </Form.Item>
                  ) : (
                    'Store Service Identifier'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'department_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Department Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Department Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cost_center']} valuePropName="checked" noStyle>
                      <Checkbox>Cost Center</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost Center'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'unit_of_measure']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Unit Of Measure</Checkbox>
                    </Form.Item>
                  ) : (
                    'Unit Of Measure'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'resource_group']} valuePropName="checked" noStyle>
                      <Checkbox>Resource Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Group'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'billing_currency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Currency'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'offer_id']} valuePropName="checked" noStyle>
                      <Checkbox>Offer Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Offer Id'
                  )}
                  <Form.Item
                    name="offer_id"
                    label="Offer Id"
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
                    <Form.Item
                      name={['checked', 'billing_account_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Account Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Account Id'
                  )}
                  <Form.Item
                    name="billing_account_id"
                    label="Billing Account Id"
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
                      name={['checked', 'billing_account_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Account Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Account Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'billing_period_start_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Period Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Period Start Date'
                  )}
                  <Form.Item
                    name="billing_period_start_date"
                    label="Billing Period Start Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'billing_period_end_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Period End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Period End Date'
                  )}
                  <Form.Item
                    name="billing_period_end_date"
                    label="Billing Period End Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'billing_profile_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Profile Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Profile Id'
                  )}
                  <Form.Item
                    name="billing_profile_id"
                    label="Billing Profile Id"
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
                      name={['checked', 'billing_profile_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Billing Profile Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Billing Profile Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'part_number']} valuePropName="checked" noStyle>
                      <Checkbox>Part Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Part Number'
                  )}
                  <Form.Item
                    name="part_number"
                    label="Part Number"
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
                    <Form.Item name={['checked', 'service_family']} valuePropName="checked" noStyle>
                      <Checkbox>Service Family</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Family'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'unit_price']} valuePropName="checked" noStyle>
                      <Checkbox>Unit Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Unit Price'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'availability_zone']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Availability Zone</Checkbox>
                    </Form.Item>
                  ) : (
                    'Availability Zone'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'resource_name']} valuePropName="checked" noStyle>
                      <Checkbox>Resource Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'invoice_section_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Invoice Section Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Invoice Section Id'
                  )}
                  <Form.Item
                    name="invoice_section_id"
                    label="Invoice Section Id"
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
                      name={['checked', 'invoice_section']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Invoice Section</Checkbox>
                    </Form.Item>
                  ) : (
                    'Invoice Section'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'reservation_id']} valuePropName="checked" noStyle>
                      <Checkbox>Reservation Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Reservation Id'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'reservation_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Reservation Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Reservation Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_order_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Order Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Order Id'
                  )}
                  <Form.Item
                    name="product_order_id"
                    label="Product Order Id"
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
                      name={['checked', 'product_order_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Order Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Order Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'term']} valuePropName="checked" noStyle>
                      <Checkbox>Term</Checkbox>
                    </Form.Item>
                  ) : (
                    'Term'
                  )}
                  <Form.Item name="term" label="Term" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'publisher_name']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'plan_name']} valuePropName="checked" noStyle>
                      <Checkbox>Plan Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Plan Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'charge_type']} valuePropName="checked" noStyle>
                      <Checkbox>Charge Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Charge Type'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'frequency']} valuePropName="checked" noStyle>
                      <Checkbox>Frequency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Frequency'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'publisher_type']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher Type'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'pay_g_price']} valuePropName="checked" noStyle>
                      <Checkbox>PayGPrice</Checkbox>
                    </Form.Item>
                  ) : (
                    'PayGPrice'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'pricing_model']} valuePropName="checked" noStyle>
                      <Checkbox>Pricing Model</Checkbox>
                    </Form.Item>
                  ) : (
                    'Pricing Model'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'idle_est_savings']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Idle - EST Savings</Checkbox>
                    </Form.Item>
                  ) : (
                    'Idle - EST Savings'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'placement_est_savings']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Placement - EST Savings</Checkbox>
                    </Form.Item>
                  ) : (
                    'Placement - EST Savings'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'vm_resource_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>VM - Resource Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'VM - Resource Name'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ri_est_savings']} valuePropName="checked" noStyle>
                      <Checkbox>RI - Est Savings</Checkbox>
                    </Form.Item>
                  ) : (
                    'RI - Est Savings'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'ahb_est_savings']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>AHB - Est Savings</Checkbox>
                    </Form.Item>
                  ) : (
                    'AHB - Est Savings'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'dev_test_est_savings']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>DevTest - Est Savings</Checkbox>
                    </Form.Item>
                  ) : (
                    'DevTest - Est Savings'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'resource_rate_list']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>ResourceRate - List</Checkbox>
                    </Form.Item>
                  ) : (
                    'ResourceRate - List'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'discount']} valuePropName="checked" noStyle>
                      <Checkbox>Discount</Checkbox>
                    </Form.Item>
                  ) : (
                    'Discount'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'rate_card_unit']} valuePropName="checked" noStyle>
                      <Checkbox>Rate Card Unit</Checkbox>
                    </Form.Item>
                  ) : (
                    'Rate Card Unit'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'usage']} valuePropName="checked" noStyle>
                      <Checkbox>Usage</Checkbox>
                    </Form.Item>
                  ) : (
                    'Usage'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'growth']} valuePropName="checked" noStyle>
                      <Checkbox>Growth</Checkbox>
                    </Form.Item>
                  ) : (
                    'Growth'
                  )}
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
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product_id']} valuePropName="checked" noStyle>
                      <Checkbox>Product Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Id'
                  )}
                  <Form.Item
                    name="product_id"
                    label="Product Id"
                    className="m-0"
                    rules={[{ max: 50 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'resource_group_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Resource Group Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Group Name'
                  )}
                  <Form.Item
                    name="resource_group_name"
                    label="Resource Group Name"
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
                    <Form.Item name={['checked', 'resource_id']} valuePropName="checked" noStyle>
                      <Checkbox>Resource Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Id'
                  )}
                  <Form.Item
                    name="resource_id"
                    label="Resource Id"
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
                    <Form.Item name={['checked', 'location']} valuePropName="checked" noStyle>
                      <Checkbox>Location</Checkbox>
                    </Form.Item>
                  ) : (
                    'Location'
                  )}
                  <Form.Item
                    name="location"
                    label="Location"
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
                      name={['checked', 'effective_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Effective Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Effective Price'
                  )}
                  <Form.Item
                    name="effective_price"
                    label="Effective Price"
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
                    <Form.Item
                      name={['checked', 'pricing_currency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Pricing Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Pricing Currency'
                  )}
                  <Form.Item
                    name="pricing_currency"
                    label="Pricing Currency"
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
                    <Form.Item
                      name={['checked', 'cost_in_billing_currency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cost In Billing Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost In Billing Currency'
                  )}
                  <Form.Item
                    name="cost_in_billing_currency"
                    label="Cost In Billing Currency"
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
                      name={['checked', 'cost_in_pricing_currency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cost In Pricing Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost In Pricing Currency'
                  )}
                  <Form.Item
                    name="cost_in_pricing_currency"
                    label="Cost In Pricing Currency"
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
                    <Form.Item name={['checked', 'cost_in_usd']} valuePropName="checked" noStyle>
                      <Checkbox>Cost In Usd</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost In Usd'
                  )}
                  <Form.Item
                    name="cost_in_usd"
                    label="Cost In Usd"
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
                      name={['checked', 'payg_cost_in_billing_currency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>PAYG Cost In Billing Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'PAYG Cost In Billing Currency'
                  )}
                  <Form.Item
                    name="payg_cost_in_billing_currency"
                    label="PAYG Cost In Billing Currency"
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
                      name={['checked', 'payg_cost_in_usd']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>PAYG Cost In Usd</Checkbox>
                    </Form.Item>
                  ) : (
                    'PAYG Cost In Usd'
                  )}
                  <Form.Item
                    name="payg_cost_in_usd"
                    label="PAYG Cost In Usd"
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
                      name={['checked', 'exchange_rate_pricing_to_billing']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exchange Rate Pricing To Billing</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange Rate Pricing To Billing'
                  )}
                  <Form.Item
                    name="exchange_rate_pricing_to_billing"
                    label="Exchange Rate Pricing To Billing"
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
                    <Form.Item name={['checked', 'cost']} valuePropName="checked" noStyle>
                      <Checkbox>Cost</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cost'
                  )}
                  <Form.Item name="cost" label="Cost" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'exchange_rate_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exchange Rate Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange Rate Date'
                  )}
                  <Form.Item
                    name="exchange_rate_date"
                    label="Exchange Rate Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'environment']} valuePropName="checked" noStyle>
                      <Checkbox>Environment</Checkbox>
                    </Form.Item>
                  ) : (
                    'Environment'
                  )}
                  <Form.Item
                    name="environment"
                    label="Environment"
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
                      name={['checked', 'environment_tags']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Environment - Tags</Checkbox>
                    </Form.Item>
                  ) : (
                    'Environment - Tags'
                  )}
                  <Form.Item
                    name="environment_tags"
                    label="Environment - Tags"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="charges_billed_separately"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'charges_billed_separately']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Charges Billed Separately</Checkbox>
                    </Form.Item>
                  ) : (
                    'Charges Billed Separately'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_azure_credit_eligible"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_azure_credit_eligible']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>is Azure Credit Eligible</Checkbox>
                    </Form.Item>
                  ) : (
                    'is Azure Credit Eligible'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="idle" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'idle']} valuePropName="checked" noStyle>
                      <Checkbox>Idle</Checkbox>
                    </Form.Item>
                  ) : (
                    'Idle'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="placement" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'placement']} valuePropName="checked" noStyle>
                      <Checkbox>Placement</Checkbox>
                    </Form.Item>
                  ) : (
                    'Placement'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ri_applied" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ri_applied']} valuePropName="checked" noStyle>
                      <Checkbox>RI Applied</Checkbox>
                    </Form.Item>
                  ) : (
                    'RI Applied'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ri_suggested" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ri_suggested']} valuePropName="checked" noStyle>
                      <Checkbox>RI Suggested</Checkbox>
                    </Form.Item>
                  ) : (
                    'RI Suggested'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ahb_applied" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ahb_applied']} valuePropName="checked" noStyle>
                      <Checkbox>AHB - Applied</Checkbox>
                    </Form.Item>
                  ) : (
                    'AHB - Applied'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ahb_suggested" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ahb_suggested']} valuePropName="checked" noStyle>
                      <Checkbox>AHB - Suggested</Checkbox>
                    </Form.Item>
                  ) : (
                    'AHB - Suggested'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dev_test_applied" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'dev_test_applied']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Dev - Test Applied</Checkbox>
                    </Form.Item>
                  ) : (
                    'Dev - Test Applied'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dev_test_suggested" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'dev_test_suggested']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Dev-Test Suggested</Checkbox>
                    </Form.Item>
                  ) : (
                    'dev_test_suggested'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="dev_test_eligible" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'dev_test_eligible']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Dev Test Eligible</Checkbox>
                    </Form.Item>
                  ) : (
                    'Dev Test Eligible'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={azureDailyUsage.save.loading || commonLookups.save.loading}
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
