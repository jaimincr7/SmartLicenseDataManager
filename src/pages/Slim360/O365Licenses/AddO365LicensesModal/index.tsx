import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ISlim360O365Licenses } from '../../../../services/slim360/o365Licenses/o365Licenses.model';
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
  saveSlim360O365Licenses,
  getSlim360O365LicensesById,
} from '../../../../store/slim360/o365Licenses/o365Licenses.action';
import {
  clearSlim360O365LicensesMessages,
  clearSlim360O365LicensesGetById,
  slim360O365LicensesSelector,
} from '../../../../store/slim360/o365Licenses/o365Licenses.reducer';
import { IAddSlim360O365LicensesProps } from './addO365Licenses.model';

const { Option } = Select;

const AddSlim360O365LicensesModal: React.FC<IAddSlim360O365LicensesProps> = (props) => {
  const slim360O365Licenses = useAppSelector(slim360O365LicensesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Slim360O365Licenses} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISlim360O365Licenses = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    azure_id: '',
    azure_tenant_id: '',
    sku_id: '',
    sku_name: '',
    sku_part_number: '',
    applies_to: '',
    purchased: null,
    consumed: null,
    available: null,
    suspended: null,
    warning: null,
    baseline: null,
    cost: null,
    item_cost: null,
    expiration_date: '',
    payment_cycle: '',
    plans: '',
    committed_year_1: null,
    committed_year_2: null,
    committed_year_3: null,
    year_1_item_cost: null,
    year_2_item_cost: null,
    year_3_item_cost: null,
    future_item_cost: null,
    csp_item_cost: null,
    current_year_item_cost: null,
    current_year_committed: null,
    current_avg_price: null,
    current_purchase_cost: null,
    date_added: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISlim360O365Licenses = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSlim360O365Licenses(inputValues));
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

  const fillValuesOnEdit = async (data: ISlim360O365Licenses) => {
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
        azure_id: data.azure_id,
        azure_tenant_id: data.azure_tenant_id,
        sku_id: data.sku_id,
        sku_name: data.sku_name,
        sku_part_number: data.sku_part_number,
        applies_to: data.applies_to,
        purchased: data.purchased,
        consumed: data.consumed,
        available: data.available,
        suspended: data.suspended,
        warning: data.warning,
        baseline: data.baseline,
        cost: data.cost,
        item_cost: data.item_cost,
        expiration_date: _.isNull(data.expiration_date) ? null : moment(data.expiration_date),
        payment_cycle: data.payment_cycle,
        plans: data.plans,
        committed_year_1: data.committed_year_1,
        committed_year_2: data.committed_year_2,
        committed_year_3: data.committed_year_3,
        year_1_item_cost: data.year_1_item_cost,
        year_2_item_cost: data.year_2_item_cost,
        year_3_item_cost: data.year_3_item_cost,
        future_item_cost: data.future_item_cost,
        csp_item_cost: data.csp_item_cost,
        current_year_item_cost: data.current_year_item_cost,
        current_year_committed: data.current_year_committed,
        current_avg_price: data.current_avg_price,
        current_purchase_cost: data.current_purchase_cost,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (slim360O365Licenses.save.messages.length > 0) {
      if (slim360O365Licenses.save.hasErrors) {
        toast.error(slim360O365Licenses.save.messages.join(' '));
      } else {
        toast.success(slim360O365Licenses.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSlim360O365LicensesMessages());
    }
  }, [slim360O365Licenses.save.messages]);

  useEffect(() => {
    if (+id > 0 && slim360O365Licenses.getById.data) {
      const data = slim360O365Licenses.getById.data;
      fillValuesOnEdit(data);
    }
  }, [slim360O365Licenses.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getSlim360O365LicensesById(+id));
    }
    return () => {
      dispatch(clearSlim360O365LicensesGetById());
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
        {slim360O365Licenses.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={slim360O365Licenses.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="slim360O365Licenses"
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
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: true }]}
                  >
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
                  <label className="label">Azure Id</label>
                  <Form.Item
                    name="azure_id"
                    label="Azure Id"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Azure Tenant Id</label>
                  <Form.Item
                    name="azure_tenant_id"
                    className="m-0"
                    label="Azure Tenant Id"
                    rules={[{ max: 36, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Sku Id</label>
                  <Form.Item name="sku_id" className="m-0" label="Sku Id" rules={[{ max: 36 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Sku Name</label>
                  <Form.Item
                    name="sku_name"
                    className="m-0"
                    label="Sku Name"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Sku Part Number</label>
                  <Form.Item
                    name="sku_part_number"
                    className="m-0"
                    label="Sku Part Number"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Applies To</label>
                  <Form.Item
                    name="applies_to"
                    label="Applies To"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Purchased</label>
                  <Form.Item
                    name="purchased"
                    label="Purchased"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Consumed</label>
                  <Form.Item
                    name="consumed"
                    label="Consumed"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Available</label>
                  <Form.Item
                    name="available"
                    label="Available"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Suspended</label>
                  <Form.Item
                    name="suspended"
                    label="Suspended"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Warning</label>
                  <Form.Item
                    name="warning"
                    label="Warning"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Baseline</label>
                  <Form.Item name="baseline" className="m-0" label="Baseline">
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cost</label>
                  <Form.Item name="cost" label="Cost" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Item Cost</label>
                  <Form.Item
                    name="item_cost"
                    label="Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Expiration Date</label>
                  <Form.Item
                    name="expiration_date"
                    label="Expiration Date"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Payment Cycle</label>
                  <Form.Item
                    name="payment_cycle"
                    label="Payment Cycle"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Plans</label>
                  <Form.Item name="plans" label="Plans" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Committed Year 1</label>
                  <Form.Item
                    name="committed_year_1"
                    label="Committed Year 1"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Committed Year 2</label>
                  <Form.Item
                    name="committed_year_2"
                    label="Committed Year 2"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Committed Year 3</label>
                  <Form.Item
                    name="committed_year_3"
                    label="Committed Year 3"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Year 1 Item Cost</label>
                  <Form.Item
                    name="year_1_item_cost"
                    label="Year 1 Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Year 2 Item Cost</label>
                  <Form.Item
                    name="year_2_item_cost"
                    label="Year 2 Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Year 3 Item Cost</label>
                  <Form.Item
                    name="year_3_item_cost"
                    label="Year 3 Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Future Item Cost</label>
                  <Form.Item
                    name="future_item_cost"
                    label="Future Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Csp Item Cost</label>
                  <Form.Item
                    name="csp_item_cost"
                    label="Csp Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Current Year Item Cost</label>
                  <Form.Item
                    name="current_year_item_cost"
                    label="Current Year Item Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Current Year Committed</label>
                  <Form.Item
                    name="current_year_committed"
                    label="Current Year Committed"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Current Average Price</label>
                  <Form.Item
                    name="current_avg_price"
                    label="Current Average Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Current Purchase Cost</label>
                  <Form.Item
                    name="current_purchase_cost"
                    label="Current Purchase Cost"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={slim360O365Licenses.save.loading}
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
export default AddSlim360O365LicensesModal;
