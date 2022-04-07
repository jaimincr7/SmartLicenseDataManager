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
import { IO365SubscribedSkus } from '../../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getCurrencyLookup,
  getO365ProductsLookup,
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
  getO365SubscribedSkusById,
  saveO365SubscribedSkus,
} from '../../../../store/o365/o365SubscribedSkus/o365SubscribedSkus.action';
import {
  clearO365SubscribedSkusGetById,
  clearO365SubscribedSkusMessages,
  o365SubscribedSkusSelector,
} from '../../../../store/o365/o365SubscribedSkus/o365SubscribedSkus.reducer';
import { IAddO365SubscribedSkusProps } from './addO365SubscribedSkus.model';

const { Option } = Select;

const AddO365SubscribedSkusModal: React.FC<IAddO365SubscribedSkusProps> = (props) => {
  const o365SubscribedSkus = useAppSelector(o365SubscribedSkusSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || commonLookups.save.loading ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}
        <BreadCrumbs pageName={Page.O365SubscribedSkus} level={1} />
      </>
    );
  }, [isNew]);

  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365SubscribedSkus = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    capability_status: '',
    consumed_units: null,
    response_id: '',
    sku_id: '',
    sku_part_number: '',
    applies_to: '',
    enabled: null,
    suspended: null,
    warning: null,
    service_plans: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IO365SubscribedSkus = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveO365SubscribedSkus(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        o365SubscribedSkus.search.tableName
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

  const fillValuesOnEdit = async (data) => {
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
        capability_status: data.capability_status,
        consumed_units: _.isNull(data.consumed_units) ? null : data.consumed_units,
        response_id: data.response_id,
        sku_id: data.sku_id,
        sku_part_number: data.sku_part_number,
        applies_to: data.applies_to,
        enabled: _.isNull(data.enabled) ? null : data.enabled,
        suspended: _.isNull(data.suspended) ? null : data.suspended,
        warning: _.isNull(data.warning) ? null : data.warning,
        service_plans: data.service_plans,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365SubscribedSkus.save.messages.length > 0) {
      if (o365SubscribedSkus.save.hasErrors) {
        toast.error(o365SubscribedSkus.save.messages.join(' '));
      } else {
        toast.success(o365SubscribedSkus.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365SubscribedSkusMessages());
    }
  }, [o365SubscribedSkus.save.messages]);

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
    if (+id > 0 && o365SubscribedSkus.getById.data) {
      const data = o365SubscribedSkus.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365SubscribedSkus.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    dispatch(getCurrencyLookup());
    dispatch(getO365ProductsLookup());
    if (+id > 0) {
      dispatch(getO365SubscribedSkusById(+id));
    }
    return () => {
      dispatch(clearO365SubscribedSkusGetById());
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
        {o365SubscribedSkus.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365SubscribedSkus.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365SubscribedSkus"
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
                      loading={commonLookups.tenantLookup.loading}
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
                      name={['checked', 'capability_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Capability Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Capability Status'
                  )}
                  <Form.Item
                    name="capability_status"
                    label="Capability Status"
                    className="m-0"
                    rules={[{ max: 50 }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'consumed_units']} valuePropName="checked" noStyle>
                      <Checkbox>Consumed Units</Checkbox>
                    </Form.Item>
                  ) : (
                    'Consumed Units'
                  )}
                  <Form.Item
                    name="consumed_units"
                    label="Consumed Units"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'applies_to']} valuePropName="checked" noStyle>
                      <Checkbox>Applies To</Checkbox>
                    </Form.Item>
                  ) : (
                    'Applies To'
                  )}
                  <Form.Item
                    name="applies_to"
                    label="Applies To"
                    className="m-0"
                    rules={[{ max: 50 }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'response_id']} valuePropName="checked" noStyle>
                      <Checkbox>Response Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Response Id'
                  )}
                  <Form.Item
                    name="response_id"
                    label="Response Id"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sku_id']} valuePropName="checked" noStyle>
                      <Checkbox>SKU Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'SKU Id'
                  )}
                  <Form.Item name="sku_id" label="SKU Id" className="m-0" rules={[{ max: 36 }]}>
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'sku_part_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>SKU Part Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'SKU Part Number'
                  )}
                  <Form.Item
                    name="sku_part_number"
                    label="SKU Part Number"
                    className="m-0"
                    rules={[{ max: 50 }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'appliesTo']} valuePropName="checked" noStyle>
                      <Checkbox>Applies To</Checkbox>
                    </Form.Item>
                  ) : (
                    'Applies To'
                  )}
                  <Form.Item
                    name="appliesTo"
                    label="Applies To"
                    className="m-0"
                    rules={[{ max: 50 }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_plans']} valuePropName="checked" noStyle>
                      <Checkbox>Service Plans</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service Plans'
                  )}
                  <Form.Item name="service_plans" label="Service Plans" className="m-0">
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Enabled'
                  )}
                  <Form.Item
                    name="enabled"
                    label="Enabled"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'suspended']} valuePropName="checked" noStyle>
                      <Checkbox>Suspended</Checkbox>
                    </Form.Item>
                  ) : (
                    'Suspended'
                  )}
                  <Form.Item
                    name="suspended"
                    label="Suspended"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warning']} valuePropName="checked" noStyle>
                      <Checkbox>Warning</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warning'
                  )}
                  <Form.Item
                    name="warning"
                    label="Warning"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365SubscribedSkus.save.loading || commonLookups.save.loading}
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
export default AddO365SubscribedSkusModal;
