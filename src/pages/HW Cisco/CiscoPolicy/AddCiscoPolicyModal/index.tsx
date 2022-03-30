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
import { ICiscoPolicy } from '../../../../services/hwCisco/ciscoPolicy/ciscoPolicy.model';
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
  saveCiscoPolicy,
  getCiscoPolicyById,
} from '../../../../store/hwCisco/ciscoPolicy/ciscoPolicy.action';
import {
  ciscoPolicySelector,
  clearCiscoPolicyMessages,
  clearCiscoPolicyGetById,
} from '../../../../store/hwCisco/ciscoPolicy/ciscoPolicy.reducer';
import { IAddCiscoPolicyProps } from './addCiscoPolicy.model';

const { Option } = Select;

const AddCiscoPolicyModal: React.FC<IAddCiscoPolicyProps> = (props) => {
  const ciscoPolicy = useAppSelector(ciscoPolicySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoPolicy} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoPolicy = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    uid: null,
    product_id: null,
    serial_number: '',
    instance_id: '',
    parent_child_indicator: '',
    minor_follow_parent: false,
    quote_group: '',
    quote_service_level: '',
    quote_begin_date: null,
    quote_end_date: null,
    quote_eos: '',
    service_level_compare: '',
    quote_price: null,
    quote_number: '',
    quote_issues: '',
    action: '',
    response: '',
    requested_service_level: '',
    duration_exception: '',
    redundant_system: false,
    quote_status: '',
    cancellation_tracking: '',
    canceled_recovered_amount: '',
    ineligible_reason: '',
    coverage_review: '',
    coverage_review_category: '',
    is_device_within_coverage_policy: false,
    coverage_policy_exclusion_reason: '',
    ldos: false,
    valid_through_l_do_s: false,
    eligible_for_quoting: false,
    coverage_required: false,
    coverage_declined_reason: '',
    coverage_expiration: null,
    product_quantity: null,
    service_indicator: '',
    service_level: '',
    service_level_desc: '',
    contract_status: '',
    contract_number: '',
    start_date: null,
    end_date: null,
    service_vendor: '',
    maintenance_price: null,
    maintenance_po: '',
    maintenance_so: '',
    service_program: '',
    second_service_level: '',
    second_service_level_desc: '',
    second_contract_status: '',
    second_contract_number: '',
    second_start_date: null,
    second_end_date: null,
    second_svc_vendor: '',
    second_maintenance_price: null,
    second_maintenance_po: '',
    second_maintenance_so: '',
    second_service_program: '',
    service_renewal_date: null,
    service_auto_renewal_term: '',
    service_billing_frequency: '',
    service_monthly_cost: null,
    sample: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoPolicy = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.quote_begin_date = passDateToApi(inputValues.quote_begin_date, true);
    inputValues.quote_end_date = passDateToApi(inputValues.quote_end_date, true);
    inputValues.coverage_expiration = passDateToApi(inputValues.coverage_expiration, true);
    inputValues.start_date = passDateToApi(inputValues.start_date, true);
    inputValues.end_date = passDateToApi(inputValues.end_date, true);
    inputValues.second_start_date = passDateToApi(inputValues.second_start_date, true);
    inputValues.second_end_date = passDateToApi(inputValues.second_end_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoPolicy(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoPolicy.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoPolicy) => {
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
        uid: data.uid,
        product_id: data.product_id,
        serial_number: data.serial_number,
        instance_id: data.instance_id,
        parent_child_indicator: data.parent_child_indicator,
        minor_follow_parent: data.minor_follow_parent,
        quote_group: data.quote_group,
        quote_service_level: data.quote_service_level,
        quote_begin_date: _.isNull(data.quote_begin_date)
          ? null
          : forEditModal(data.quote_begin_date),
        quote_end_date: _.isNull(data.quote_end_date) ? null : forEditModal(data.quote_end_date),
        quote_eos: data.quote_eos,
        service_level_compare: data.service_level,
        quote_price: data.quote_price,
        quote_number: data.quote_number,
        quote_issues: data.quote_issues,
        action: data.action,
        response: data.response,
        requested_service_level: data.requested_service_level,
        duration_exception: data.duration_exception,
        redundant_system: data.redundant_system,
        quote_status: data.quote_status,
        cancellation_tracking: data.cancellation_tracking,
        canceled_recovered_amount: data.canceled_recovered_amount,
        ineligible_reason: data.ineligible_reason,
        coverage_review: data.coverage_review,
        coverage_review_category: data.coverage_review_category,
        is_device_within_coverage_policy: data.is_device_within_coverage_policy,
        coverage_policy_exclusion_reason: data.coverage_policy_exclusion_reason,
        ldos: data.ldos,
        valid_through_l_do_s: data.valid_through_l_do_s,
        eligible_for_quoting: data.eligible_for_quoting,
        coverage_required: data.coverage_required,
        coverage_declined_reason: data.coverage_declined_reason,
        coverage_expiration: _.isNull(data.coverage_expiration)
          ? null
          : forEditModal(data.coverage_expiration),
        product_quantity: data.product_quantity,
        service_indicator: data.service_indicator,
        service_level: data.service_level,
        service_level_desc: data.service_level_desc,
        contract_status: data.contract_status,
        contract_number: data.contract_number,
        start_date: _.isNull(data.start_date) ? null : forEditModal(data.start_date),
        end_date: _.isNull(data.end_date) ? null : forEditModal(data.end_date),
        service_vendor: data.service_vendor,
        maintenance_price: data.maintenance_price,
        maintenance_po: data.maintenance_po,
        maintenance_so: data.maintenance_so,
        service_program: data.service_program,
        second_service_level: data.second_service_level,
        second_service_level_desc: data.second_service_level_desc,
        second_contract_status: data.second_contract_status,
        second_contract_number: data.second_contract_number,
        second_start_date: _.isNull(data.second_start_date)
          ? null
          : forEditModal(data.second_start_date),
        second_end_date: _.isNull(data.second_end_date) ? null : forEditModal(data.second_end_date),
        second_svc_vendor: data.second_svc_vendor,
        second_maintenance_price: data.second_maintenance_price,
        second_maintenance_po: data.second_maintenance_po,
        second_maintenance_so: data.second_maintenance_po,
        second_service_program: data.second_service_program,
        service_renewal_date: data.service_renewal_date,
        service_auto_renewal_term: data.service_auto_renewal_term,
        service_billing_frequency: data.service_billing_frequency,
        service_monthly_cost: data.service_monthly_cost,
        sample: data.sample,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoPolicy.save.messages.length > 0) {
      if (ciscoPolicy.save.hasErrors) {
        toast.error(ciscoPolicy.save.messages.join(' '));
      } else {
        toast.success(ciscoPolicy.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoPolicyMessages());
    }
  }, [ciscoPolicy.save.messages]);

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
    if (+id > 0 && ciscoPolicy.getById.data) {
      const data = ciscoPolicy.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoPolicy.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoPolicyById(+id));
    }
    return () => {
      dispatch(clearCiscoPolicyGetById());
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
        {ciscoPolicy.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoPolicy.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoPolicy"
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
                    <Form.Item name={['checked', 'uid']} valuePropName="checked" noStyle>
                      <Checkbox>UID</Checkbox>
                    </Form.Item>
                  ) : (
                    'UID'
                  )}
                  <Form.Item
                    name="uid"
                    className="m-0"
                    label="UID"
                    rules={[{ max: 200, required: !isMultiple }]}
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
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 200, required: !isMultiple }]}
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
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
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
                    className="m-0"
                    label="Instance ID"
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
                      name={['checked', 'parent_child_indicator']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Child Indicator</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Child Indicator'
                  )}
                  <Form.Item
                    name="parent_child_indicator"
                    label="Parent Child Indicator"
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
                    <Form.Item name={['checked', 'quote_group']} valuePropName="checked" noStyle>
                      <Checkbox>Quote Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Group'
                  )}
                  <Form.Item
                    name="quote_group"
                    label="Quote Group"
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
                      name={['checked', 'quote_service_level']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Quote Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Service Level'
                  )}
                  <Form.Item
                    name="quote_service_level"
                    label="Quote Service Level"
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
                      name={['checked', 'quote_begin_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Quote Begin Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Begin Date'
                  )}
                  <Form.Item name="quote_begin_date" label="Quote Begin Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'quote_end_date']} valuePropName="checked" noStyle>
                      <Checkbox>Quote End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote End Date'
                  )}
                  <Form.Item name="quote_end_date" label="Quote End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'quote_eos']} valuePropName="checked" noStyle>
                      <Checkbox>Quote EOS</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote EOS'
                  )}
                  <Form.Item
                    name="quote_eos"
                    label="Quote EOS"
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
                      name={['checked', 'service_level_compare']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Level Compare</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level Compare'
                  )}
                  <Form.Item
                    name="service_level_compare"
                    label="Service Level Compare"
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
                    <Form.Item name={['checked', 'quote_price']} valuePropName="checked" noStyle>
                      <Checkbox>Quote Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Price'
                  )}
                  <Form.Item
                    name="quote_price"
                    label="Quote Price"
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
                    <Form.Item name={['checked', 'quote_number']} valuePropName="checked" noStyle>
                      <Checkbox>Quote Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Number'
                  )}
                  <Form.Item
                    name="quote_number"
                    label="Quote Number"
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
                    <Form.Item name={['checked', 'quote_issues']} valuePropName="checked" noStyle>
                      <Checkbox>Quote Issues</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Issues'
                  )}
                  <Form.Item
                    name="quote_issues"
                    label="Quote Issues"
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
                    <Form.Item name={['checked', 'action']} valuePropName="checked" noStyle>
                      <Checkbox>ACTION</Checkbox>
                    </Form.Item>
                  ) : (
                    'ACTION'
                  )}
                  <Form.Item name="action" label="ACTION" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'response']} valuePropName="checked" noStyle>
                      <Checkbox>RESPONSE</Checkbox>
                    </Form.Item>
                  ) : (
                    'RESPONSE'
                  )}
                  <Form.Item
                    name="response"
                    label="RESPONSE"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'requested_service_level']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Requested Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Requested Service Level'
                  )}
                  <Form.Item
                    name="requested_service_level"
                    label="Requested Service Level"
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
                      name={['checked', 'duration_exception']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Duration Exception</Checkbox>
                    </Form.Item>
                  ) : (
                    'Duration Exception'
                  )}
                  <Form.Item
                    name="duration_exception"
                    label="Duration Exception"
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
                    <Form.Item name={['checked', 'quote_status']} valuePropName="checked" noStyle>
                      <Checkbox>Quote Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Quote Status'
                  )}
                  <Form.Item
                    name="quote_status"
                    label="Quote Status"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control " />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'cancellation_tracking']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>CANCELLATION TRACKING</Checkbox>
                    </Form.Item>
                  ) : (
                    'CANCELLATION TRACKING'
                  )}
                  <Form.Item
                    name="cancellation_tracking"
                    label="CANCELLATION TRACKING"
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
                      name={['checked', 'canceled_recovered_amount']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>CANCELED RECOVERED AMOUNT</Checkbox>
                    </Form.Item>
                  ) : (
                    'CANCELED RECOVERED AMOUNT'
                  )}
                  <Form.Item
                    name="canceled_recovered_amount"
                    label="CANCELED RECOVERED AMOUNT"
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
                      name={['checked', 'ineligible_reason']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Ineligible Reason</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ineligible Reason'
                  )}
                  <Form.Item
                    name="ineligible_reason"
                    label="Ineligible Reason"
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
                      name={['checked', 'coverage_review']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Review</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Review'
                  )}
                  <Form.Item
                    name="coverage_review"
                    label="Coverage Review"
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
                      name={['checked', 'coverage_review_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Review Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Review Category'
                  )}
                  <Form.Item
                    name="coverage_review_category"
                    label="Coverage Review Category"
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
                      name={['checked', 'coverage_policy_exclusion_reason']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Policy Exclusion Reason</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Policy Exclusion Reason'
                  )}
                  <Form.Item
                    name="coverage_policy_exclusion_reason"
                    label="Coverage Policy Exclusion Reason"
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
                      name={['checked', 'coverage_declined_reason']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Declined Reason</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Declined Reason'
                  )}
                  <Form.Item
                    name="coverage_declined_reason"
                    label="Coverage Declined Reason"
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
                      name={['checked', 'coverage_expiration']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Expiration</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Expiration'
                  )}
                  <Form.Item name="coverage_expiration" label="Coverage Expiration" className="m-0">
                    <DatePicker className="w-100" />
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
                    <Form.Item
                      name={['checked', 'service_indicator']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Indicator</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Indicator'
                  )}
                  <Form.Item
                    name="service_indicator"
                    label="Service Indicator"
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
                      name={['checked', 'service_level_desc']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Level Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Level Description'
                  )}
                  <Form.Item
                    name="service_level_desc"
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
                    label="Contract Status"
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
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'start_date']} valuePropName="checked" noStyle>
                      <Checkbox>Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Start Date'
                  )}
                  <Form.Item name="start_date" label="Start Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'end_date']} valuePropName="checked" noStyle>
                      <Checkbox>End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Date'
                  )}
                  <Form.Item name="end_date" label="End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_vendor']} valuePropName="checked" noStyle>
                      <Checkbox>Service Vendor</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Vendor'
                  )}
                  <Form.Item
                    name="service_vendor"
                    label="Service Vendor"
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
                      name={['checked', 'maintenance_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Maintenance Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance Price'
                  )}
                  <Form.Item
                    name="maintenance_price"
                    label="Maintenance Price"
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
                    <Form.Item name={['checked', 'maintenance_po']} valuePropName="checked" noStyle>
                      <Checkbox>Maintenance PO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance PO'
                  )}
                  <Form.Item
                    name="maintenance_po"
                    label="Maintenance PO"
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
                    <Form.Item name={['checked', 'maintenance_so']} valuePropName="checked" noStyle>
                      <Checkbox>Maintenance SO</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance SO'
                  )}
                  <Form.Item
                    name="maintenance_so"
                    label="Maintenance SO"
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
                    label="Service Program"
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
                      name={['checked', 'second_service_level']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Service Level</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Service Level'
                  )}
                  <Form.Item
                    name="second_service_level"
                    label="2nd Service Level"
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
                      name={['checked', 'second_service_level_desc']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Service Level Description</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Service Level Description'
                  )}
                  <Form.Item
                    name="second_service_level_desc"
                    label="2nd Service Level Description"
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
                      name={['checked', 'second_contract_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Contract Status</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Contract Status'
                  )}
                  <Form.Item
                    name="second_contract_status"
                    label="2nd Contract Status"
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
                      name={['checked', 'second_contract_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Contract Number</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Contract Number'
                  )}
                  <Form.Item
                    name="second_contract_number"
                    label="2nd Contract Number"
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
                      name={['checked', 'second_start_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Start Date'
                  )}
                  <Form.Item name="second_start_date" label="2nd Start Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'second_end_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd End Date'
                  )}
                  <Form.Item name="second_end_date" label="2nd End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'second_svc_vendor']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Svc Vendor</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Svc Vendor'
                  )}
                  <Form.Item
                    name="second_svc_vendor"
                    label="2nd Svc Vendor"
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
                      name={['checked', 'second_maintenance_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Maintenance Price</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Maintenance Price'
                  )}
                  <Form.Item
                    name="second_maintenance_price"
                    label="2nd Maintenance Price"
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
                      name={['checked', 'second_maintenance_po']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Maintenance PO</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Maintenance PO'
                  )}
                  <Form.Item
                    name="second_maintenance_po"
                    label="2nd Maintenance PO"
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
                      name={['checked', 'second_maintenance_so']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Maintenance SO</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Maintenance SO'
                  )}
                  <Form.Item
                    name="second_maintenance_so"
                    label="2nd Maintenance SO"
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
                      name={['checked', 'second_service_program']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>2nd Service Program</Checkbox>
                    </Form.Item>
                  ) : (
                    '2nd Service Program'
                  )}
                  <Form.Item
                    name="second_service_program"
                    label="2nd Service Program"
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
                      name={['checked', 'service_renewal_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Renewal Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Renewal Date'
                  )}
                  <Form.Item
                    name="service_renewal_date"
                    label="Service Renewal Date"
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
                      name={['checked', 'service_auto_renewal_term']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Auto-Renewal Term</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Auto-Renewal Term'
                  )}
                  <Form.Item
                    name="service_auto_renewal_term"
                    label="Service Auto-Renewal Term"
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
                      name={['checked', 'service_billing_frequency']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Billing Frequency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Billing Frequency'
                  )}
                  <Form.Item
                    name="service_billing_frequency"
                    label="Service Billing Frequency"
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
                      name={['checked', 'service_monthly_cost']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Service Monthly Cost</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Monthly Cost'
                  )}
                  <Form.Item
                    name="service_monthly_cost"
                    label="Service Monthly Cost"
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
                    <Form.Item name={['checked', 'sample']} valuePropName="checked" noStyle>
                      <Checkbox>SAMPLE</Checkbox>
                    </Form.Item>
                  ) : (
                    'SAMPLE'
                  )}
                  <Form.Item name="sample" label="SAMPLE" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="minor_follow_parent" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'minor_follow_parent']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Minor Follow Parent</Checkbox>
                    </Form.Item>
                  ) : (
                    'Minor Follow Parent'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="redundant_system" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'redundant_system']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Redundant System</Checkbox>
                    </Form.Item>
                  ) : (
                    'Redundant System'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_device_within_coverage_policy"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_device_within_coverage_policy']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Device Within Coverage Policy</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Device Within Coverage Policy'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ldos" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ldos']} valuePropName="checked" noStyle>
                      <Checkbox>LDOS</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDOS'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="valid_through_l_do_s" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'valid_through_l_do_s']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Valid Through LDoS</Checkbox>
                    </Form.Item>
                  ) : (
                    'Valid Through LDoS'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="eligible_for_quoting" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'eligible_for_quoting']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Eligible For Quoting</Checkbox>
                    </Form.Item>
                  ) : (
                    'Eligible For Quoting'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="coverage_required" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'coverage_required']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Required</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Required'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoPolicy.save.loading || commonLookups.save.loading}
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
export default AddCiscoPolicyModal;
