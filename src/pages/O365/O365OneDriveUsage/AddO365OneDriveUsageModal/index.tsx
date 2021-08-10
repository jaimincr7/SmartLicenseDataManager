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
import { IAddO365OneDriveUsageProps } from './addO365OneDriveUsage.model';
import {
  o365OneDriveUsageSelector,
  clearO365OneDriveUsageGetById,
  clearO365OneDriveUsageMessages,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.reducer';
import {
  getO365OneDriveUsageById,
  saveO365OneDriveUsage,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.action';
import { IO365OneDriveUsage } from '../../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.model';
import { validateMessages } from '../../../../common/constants/common';
import moment from 'moment';

const { Option } = Select;

const AddO365OneDriveUsageModal: React.FC<IAddO365OneDriveUsageProps> = (props) => {
  const o365OneDriveUsage = useAppSelector(o365OneDriveUsageSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add OneDrive Usage' : 'Edit OneDrive Usage';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365OneDriveUsage = {
    company_id: null,
    bu_id: null,
    report_refresh_date: null,
    site_url: '',
    owner_display_name: '',
    is_deleted: false,
    last_activity_date: null,
    file_count: null,
    active_file_count: null,
    storage_used_byte: null,
    storage_allocated_byte: null,
    owner_principal_name: '',
    report_period: null,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IO365OneDriveUsage = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365OneDriveUsage(inputValues));
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
    return current && current > moment().endOf('day');
  };

  const fillValuesOnEdit = async (data: IO365OneDriveUsage) => {
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
        owner_principal_name: data.owner_principal_name,
        owner_display_name: data.owner_display_name,
        last_activity_date: _.isNull(data.last_activity_date)
          ? null
          : moment(data.last_activity_date),
        site_url: data.site_url,
        is_deleted: data.is_deleted,
        file_count: data.file_count,
        active_file_count: data.active_file_count,
        storage_used_byte: data.storage_used_byte,
        storage_allocated_byte: data.storage_allocated_byte,
        report_period: data.report_period,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365OneDriveUsage.save.messages.length > 0) {
      if (o365OneDriveUsage.save.hasErrors) {
        toast.error(o365OneDriveUsage.save.messages.join(' '));
      } else {
        toast.success(o365OneDriveUsage.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365OneDriveUsageMessages());
    }
  }, [o365OneDriveUsage.save.messages]);

  useEffect(() => {
    if (+id > 0 && o365OneDriveUsage.getById.data) {
      const data = o365OneDriveUsage.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365OneDriveUsage.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365OneDriveUsageById(+id));
    }
    return () => {
      dispatch(clearO365OneDriveUsageGetById());
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
        {o365OneDriveUsage.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365OneDriveUsage.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365OneDriveUsage"
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
                  <label className="label">Report Refresh Date</label>
                  <Form.Item name="report_refresh_date" label="Report Refresh Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Owner Principal Name</label>
                  <Form.Item
                    name="owner_principal_name"
                    className="m-0"
                    label="Owner Principal Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Owner Display Name</label>
                  <Form.Item
                    name="owner_display_name"
                    className="m-0"
                    label="Owner Display Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Site URL</label>
                  <Form.Item
                    name="site_url"
                    className="m-0"
                    label="Site URL"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Activity Date</label>
                  <Form.Item name="last_activity_date" label="Last Activity Date" className="m-0">
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">File Count</label>
                  <Form.Item
                    name="file_count"
                    label="File Count"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Active File Count</label>
                  <Form.Item
                    name="active_file_count"
                    label="Active File Count"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
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
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Storage Allocated (Byte)</label>
                  <Form.Item
                    name="storage_allocated_byte"
                    label="Storage Allocated (Byte)"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
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
                    <InputNumber min={0} className="form-control w-100" />
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
                loading={o365OneDriveUsage.save.loading}
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
export default AddO365OneDriveUsageModal;
