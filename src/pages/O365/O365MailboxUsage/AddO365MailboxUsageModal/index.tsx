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
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { IO365MailboxUsage } from '../../../../services/o365/o365MailboxUsage/o365MailboxUsage.model';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Mailbox Usage' : 'Edit Mailbox Usage';
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
    deleted_date: '',
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
  };

  const onFinish = (values: any) => {
    const inputValues: IO365MailboxUsage = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365MailboxUsage(inputValues));
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
        report_refresh_date: _.isNull(data.report_refresh_date)
          ? null
          : moment(data.report_refresh_date),
        user_principal_name: data.user_principal_name,
        display_name: data.display_name,
        is_deleted: data.is_deleted,
        deleted_date: data.deleted_date,
        created_date: _.isNull(data.created_date) ? null : moment(data.created_date),
        last_activity_date: _.isNull(data.last_activity_date)
          ? null
          : moment(data.last_activity_date),
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
    if (+id > 0 && o365MailboxUsage.getById.data) {
      const data = o365MailboxUsage.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365MailboxUsage.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365MailboxUsageById(+id));
    }
    return () => {
      dispatch(clearO365MailboxUsageGetById());
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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
                  >
                    <Select
                      onChange={handleTenantChange}
                      loading={commonLookups.tenantLookup.loading}
                      allowClear
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
                      loading={commonLookups.buLookup.loading}
                      allowClear
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
                  <label className="label">Report Refresh Date</label>
                  <Form.Item name="report_refresh_date" label="Report Refresh Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">User Principal Name</label>
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
                  <label className="label">Display Name</label>
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
                  <label className="label">Deleted Date</label>
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
                  <label className="label">Created Date</label>
                  <Form.Item name="created_date" label="Created Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Activity Date</label>
                  <Form.Item name="last_activity_date" label="Last Activity Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Item Count</label>
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
                  <label className="label">Storage Used (Byte)</label>
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
                  <label className="label">Issue Warning Quota (Byte)</label>
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
                  <label className="label">Prohibit Send Quota (Byte)</label>
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
                  <label className="label">Prohibit Send/Receive Quota (Byte)</label>
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
                  <label className="label">Deleted Item Count</label>
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
                  <label className="label">Deleted Item Size (Byte)</label>
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
                  <label className="label">Report Period</label>
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
                  <label className="label">Is Deleted</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365MailboxUsage.save.loading}
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
