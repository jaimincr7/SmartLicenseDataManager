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
  forDisableDate,
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { IO365MailboxUsage } from '../../../../services/o365/o365MailboxUsage/o365MailboxUsage.model';
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
  getO365MailboxUsageById,
  saveO365MailboxUsage,
} from '../../../../store/o365/o365MailboxUsage/o365MailboxUsage.action';
import {
  clearO365MailboxUsageGetById,
  clearO365MailboxUsageMessages,
  o365MailboxUsageSelector,
} from '../../../../store/o365/o365MailboxUsage/o365MailboxUsage.reducer';
import { IAddO365MailboxUsageProps } from './addO365MailboxUsage.model';

const { Option } = Select;

const AddO365MailboxUsageModal: React.FC<IAddO365MailboxUsageProps> = (props) => {
  const o365MailboxUsage = useAppSelector(o365MailboxUsageSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.O365MailboxUsage} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365MailboxUsage = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    report_refresh_date: null,
    user_principal_name: '',
    display_name: '',
    is_deleted: false,
    deleted_date: null,
    created_date: null,
    last_activity_date: null,
    item_count: null,
    storage_used_byte: null,
    issue_warning_quota_byte: null,
    prohibit_send_quota_byte: null,
    prohibit_send_receive_quota_byte: null,
    deleted_item_count: null,
    deleted_item_size_byte: null,
    report_period: null,
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IO365MailboxUsage = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.report_refresh_date = passDateToApi(inputValues.report_refresh_date, true);
    inputValues.last_activity_date = passDateToApi(inputValues.last_activity_date, true);
    inputValues.created_date = passDateToApi(inputValues.created_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveO365MailboxUsage(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        o365MailboxUsage.search.tableName
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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > forDisableDate();
  };

  const fillValuesOnEdit = async (data: IO365MailboxUsage) => {
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
        report_refresh_date: _.isNull(data.report_refresh_date)
          ? null
          : forEditModal(data.report_refresh_date),
        user_principal_name: data.user_principal_name,
        display_name: data.display_name,
        is_deleted: data.is_deleted,
        deleted_date: data.deleted_date,
        created_date: _.isNull(data.created_date) ? null : forEditModal(data.created_date),
        last_activity_date: _.isNull(data.last_activity_date)
          ? null
          : forEditModal(data.last_activity_date),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        item_count: data.item_count,
        storage_used_byte: data.storage_used_byte,
        issue_warning_quota_byte: data.issue_warning_quota_byte,
        prohibit_send_quota_byte: data.prohibit_send_quota_byte,
        prohibit_send_receive_quota_byte: data.prohibit_send_receive_quota_byte,
        deleted_item_count: data.deleted_item_count,
        deleted_item_size_byte: data.deleted_item_size_byte,
        report_period: data.report_period,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365MailboxUsage.save.messages.length > 0) {
      if (o365MailboxUsage.save.hasErrors) {
        toast.error(o365MailboxUsage.save.messages.join(' '));
      } else {
        toast.success(o365MailboxUsage.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365MailboxUsageMessages());
    }
  }, [o365MailboxUsage.save.messages]);

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
    if (+id > 0 && o365MailboxUsage.getById.data) {
      const data = o365MailboxUsage.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365MailboxUsage.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getO365MailboxUsageById(+id));
    }
    return () => {
      dispatch(clearO365MailboxUsageGetById());
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
        {o365MailboxUsage.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365MailboxUsage.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365MailboxUsage"
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
                      name={['checked', 'report_refresh_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Report Refresh Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Report Refresh Date'
                  )}
                  <Form.Item name="report_refresh_date" label="Report Refresh Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'user_principal_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>User Principal Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'User Principal Name'
                  )}
                  <Form.Item
                    name="user_principal_name"
                    label="User Principal Name"
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
                    <Form.Item name={['checked', 'display_name']} valuePropName="checked" noStyle>
                      <Checkbox>Display Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Display Name'
                  )}
                  <Form.Item
                    name="display_name"
                    className="m-0"
                    label="Display Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'deleted_date']} valuePropName="checked" noStyle>
                      <Checkbox>Deleted Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Deleted Date'
                  )}
                  <Form.Item
                    name="deleted_date"
                    label="Deleted Date"
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
                    <Form.Item name={['checked', 'created_date']} valuePropName="checked" noStyle>
                      <Checkbox>Created Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Created Date'
                  )}
                  <Form.Item name="created_date" label="Created Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Activity Date'
                  )}
                  <Form.Item name="last_activity_date" label="Last Activity Date" className="m-0">
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'item_count']} valuePropName="checked" noStyle>
                      <Checkbox>Item Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Item Count'
                  )}
                  <Form.Item
                    name="item_count"
                    label="Item Count"
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
                      name={['checked', 'storage_used_byte']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Storage Used (Byte)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Storage Used (Byte)'
                  )}
                  <Form.Item
                    name="storage_used_byte"
                    label="Storage Used (Byte)"
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
                      name={['checked', 'issue_warning_quota_byte']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Issue Warning Quota (Byte)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Issue Warning Quota (Byte)'
                  )}
                  <Form.Item
                    name="issue_warning_quota_byte"
                    label="Issue Warning Quota (Byte)"
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
                      name={['checked', 'prohibit_send_quota_byte']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Prohibit Send Quota (Byte)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Prohibit Send Quota (Byte)'
                  )}
                  <Form.Item
                    name="prohibit_send_quota_byte"
                    label="Prohibit Send Quota (Byte)"
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
                      name={['checked', 'prohibit_send_receive_quota_byte']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Prohibit Send/Receive Quota (Byte)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Prohibit Send/Receive Quota (Byte)'
                  )}
                  <Form.Item
                    name="prohibit_send_receive_quota_byte"
                    label="Prohibit Send/Receive Quota (Byte)"
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
                      name={['checked', 'deleted_item_count']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Deleted Item Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Deleted Item Count'
                  )}
                  <Form.Item
                    name="deleted_item_count"
                    label="Deleted Item Count"
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
                      name={['checked', 'deleted_item_size_byte']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Deleted Item Size (Byte)</Checkbox>
                    </Form.Item>
                  ) : (
                    'Deleted Item Size (Byte)'
                  )}
                  <Form.Item
                    name="deleted_item_size_byte"
                    label="Deleted Item Size (Byte)"
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
                    <Form.Item name={['checked', 'report_period']} valuePropName="checked" noStyle>
                      <Checkbox>Report Period</Checkbox>
                    </Form.Item>
                  ) : (
                    'Report Period'
                  )}
                  <Form.Item
                    name="report_period"
                    label="Report Period"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_deleted" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_deleted']} valuePropName="checked" noStyle>
                      <Checkbox>Is Deleted</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Deleted'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365MailboxUsage.save.loading || commonLookups.save.loading}
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
export default AddO365MailboxUsageModal;
