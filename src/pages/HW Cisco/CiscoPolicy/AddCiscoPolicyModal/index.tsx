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
import { ICiscoPolicy } from '../../../../services/hwCisco/ciscoPolicy/ciscoPolicy.model';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoPolicy = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCiscoPolicy(inputValues));
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
        quote_begin_date: _.isNull(data.quote_begin_date) ? null : moment(data.quote_begin_date),
        quote_end_date: _.isNull(data.quote_end_date) ? null : moment(data.quote_end_date),
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
          : moment(data.coverage_expiration),
        product_quantity: data.product_quantity,
        service_indicator: data.service_indicator,
        service_level: data.service_level,
        service_level_desc: data.service_level_desc,
        contract_status: data.contract_status,
        contract_number: data.contract_number,
        start_date: _.isNull(data.start_date) ? null : moment(data.start_date),
        end_date: _.isNull(data.end_date) ? null : moment(data.end_date),
        service_vendor: data.service_vendor,
        maintenance_price: data.maintenance_price,
        maintenance_po: data.maintenance_po,
        maintenance_so: data.maintenance_so,
        service_program: data.service_program,
        second_service_level: data.second_service_level,
        second_service_level_desc: data.second_service_level_desc,
        second_contract_status: data.second_contract_status,
        second_contract_number: data.second_contract_number,
        second_start_date: _.isNull(data.second_start_date) ? null : moment(data.second_start_date),
        second_end_date: _.isNull(data.second_end_date) ? null : moment(data.second_end_date),
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
                  <label className="label">UID</label>
                  <Form.Item
                    name="uid"
                    className="m-0"
                    label="UID"
                    rules={[{ max: 200, required: true }]}
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
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 200, required: true }]}
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
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Instance ID</label>
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
                  <label className="label">Parent Child Indicator</label>
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
                  <label className="label">Quote Group</label>
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
                  <label className="label">Quote Service Level</label>
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
                  <label className="label">Quote Begin Date</label>
                  <Form.Item name="quote_begin_date" label="Quote Begin Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Quote End Date</label>
                  <Form.Item name="quote_end_date" label="Quote End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Quote EOS</label>
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
                  <label className="label">Service Level Compare</label>
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
                  <label className="label">Quote Price</label>
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
                  <label className="label">Quote Number</label>
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
                  <label className="label">Quote Issues</label>
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
                  <label className="label">ACTION</label>
                  <Form.Item name="action" label="ACTION" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">RESPONSE</label>
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
                  <label className="label">Requested Service Level</label>
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
                  <label className="label">Duration Exception</label>
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
                  <label className="label">Quote Status</label>
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
                  <label className="label">CANCELLATION TRACKING</label>
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
                  <label className="label">CANCELED RECOVERED AMOUNT</label>
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
                  <label className="label">Ineligible Reason</label>
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
                  <label className="label">Coverage Review</label>
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
                  <label className="label">Coverage Review Category</label>
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
                  <label className="label">Coverage Policy Exclusion Reason</label>
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
                  <label className="label">Coverage Declined Reason</label>
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
                  <label className="label">Coverage Expiration</label>
                  <Form.Item name="coverage_expiration" label="Coverage Expiration" className="m-0">
                    <DatePicker className="w-100" />
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
                  <label className="label">Service Indicator</label>
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
                  <label className="label">Service Level</label>
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
                  <label className="label">Service Level Desc</label>
                  <Form.Item
                    name="service_level_desc"
                    label="Service Level Desc"
                    className="m-0"
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
                  <label className="label">Contract Number</label>
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
                  <label className="label">Start Date</label>
                  <Form.Item name="start_date" label="Start Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End Date</label>
                  <Form.Item name="end_date" label="End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service Vendor</label>
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
                  <label className="label">Maintenance Price</label>
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
                  <label className="label">Maintenance PO</label>
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
                  <label className="label">Maintenance SO</label>
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
                  <label className="label">Service Program</label>
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
                  <label className="label">2nd Service Level</label>
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
                  <label className="label">2nd Service Level Desc</label>
                  <Form.Item
                    name="second_service_level_desc"
                    label="2nd Service Level Desc"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">2nd Contract Status</label>
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
                  <label className="label">2nd Contract Number</label>
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
                  <label className="label">2nd Start Date</label>
                  <Form.Item name="second_start_date" label="2nd Start Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">2nd End Date</label>
                  <Form.Item name="second_end_date" label="2nd End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">2nd Svc Vendor</label>
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
                  <label className="label">2nd Maintenance Price</label>
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
                  <label className="label">2nd Maintenance PO</label>
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
                  <label className="label">2nd Maintenance SO</label>
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
                  <label className="label">2nd Service Program</label>
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
                  <label className="label">Service Renewal Date</label>
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
                  <label className="label">Service Auto-Renewal Term</label>
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
                  <label className="label">Service Billing Frequency</label>
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
                  <label className="label">Service Monthly Cost</label>
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
                  <label className="label">SAMPLE</label>
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
                  <label className="label">Minor Follow Parent</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="redundant_system" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Redundant System</label>
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
                  <label className="label">Is device within Coverage Policy?</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ldos" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">LDOS</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="valid_through_l_do_s" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Valid Through LDoS</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="eligible_for_quoting" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Eligible For Quoting</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="coverage_required" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Coverage Required</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoPolicy.save.loading}
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
