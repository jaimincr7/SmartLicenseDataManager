import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
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
import { IAddO365ActiveUserDetailProps } from './addO365ActiveUserDetail.model';
import {
  o365ActiveUserDetailSelector,
  clearO365ActiveUserDetailGetById,
  clearO365ActiveUserDetailMessages,
} from '../../../../store/o365/o365ActiveUserDetail/o365ActiveUserDetail.reducer';
import {
  getO365ActiveUserDetailById,
  saveO365ActiveUserDetail,
} from '../../../../store/o365/o365ActiveUserDetail/o365ActiveUserDetail.action';
import { IO365ActiveUserDetail } from '../../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.model';
import { validateMessages } from '../../../../common/constants/common';
import moment from 'moment';

const { Option } = Select;

const AddO365ActiveUserDetailModal: React.FC<IAddO365ActiveUserDetailProps> = (props) => {
  const o365ActiveUserDetail = useAppSelector(o365ActiveUserDetailSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Active User Detail' : 'Edit Active User Detail';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365ActiveUserDetail = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    report_refresh_date: null,
    user_principal_name: '',
    display_name: '',
    is_deleted: false,
    deleted_date: '',
    has_exchange_license: false,
    has_one_drive_license: false,
    has_share_point_license: false,
    has_skype_for_business_license: false,
    has_yammer_license: false,
    has_teams_license: false,
    exchange_last_activity_date: null,
    one_drive_last_activity_date: null,
    share_point_last_activity_date: null,
    skype_for_business_last_activity_date: null,
    yammer_last_activity_date: null,
    teams_last_activity_date: null,
    exchange_license_assign_date: null,
    one_drive_license_assign_date: null,
    share_point_license_assign_date: null,
    skype_for_business_license_assign_date: null,
    yammer_license_assign_date: null,
    teams_license_assign_date: null,
    assigned_products: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IO365ActiveUserDetail = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365ActiveUserDetail(inputValues));
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

  const fillValuesOnEdit = async (data: IO365ActiveUserDetail) => {
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
        has_exchange_license: data.has_exchange_license,
        has_one_drive_license: data.has_one_drive_license,
        has_share_point_license: data.has_share_point_license,
        has_skype_for_business_license: data.has_skype_for_business_license,
        has_yammer_license: data.has_yammer_license,
        has_teams_license: data.has_teams_license,
        exchange_last_activity_date: _.isNull(data.exchange_last_activity_date)
          ? null
          : moment(data.exchange_last_activity_date),
        one_drive_last_activity_date: _.isNull(data.one_drive_last_activity_date)
          ? null
          : moment(data.one_drive_last_activity_date),
        share_point_last_activity_date: _.isNull(data.share_point_last_activity_date)
          ? null
          : moment(data.share_point_last_activity_date),
        skype_for_business_last_activity_date: _.isNull(data.skype_for_business_last_activity_date)
          ? null
          : moment(data.skype_for_business_last_activity_date),
        yammer_last_activity_date: _.isNull(data.yammer_last_activity_date)
          ? null
          : moment(data.yammer_last_activity_date),
        teams_last_activity_date: _.isNull(data.teams_last_activity_date)
          ? null
          : moment(data.teams_last_activity_date),
        exchange_license_assign_date: _.isNull(data.exchange_license_assign_date)
          ? null
          : moment(data.exchange_license_assign_date),
        one_drive_license_assign_date: _.isNull(data.one_drive_license_assign_date)
          ? null
          : moment(data.one_drive_license_assign_date),
        share_point_license_assign_date: _.isNull(data.share_point_license_assign_date)
          ? null
          : moment(data.share_point_license_assign_date),
        skype_for_business_license_assign_date: _.isNull(
          data.skype_for_business_license_assign_date
        )
          ? null
          : moment(data.skype_for_business_license_assign_date),
        yammer_license_assign_date: _.isNull(data.yammer_license_assign_date)
          ? null
          : moment(data.yammer_license_assign_date),
        teams_license_assign_date: _.isNull(data.teams_last_activity_date)
          ? null
          : moment(data.teams_last_activity_date),
        assigned_products: data.assigned_products,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365ActiveUserDetail.save.messages.length > 0) {
      if (o365ActiveUserDetail.save.hasErrors) {
        toast.error(o365ActiveUserDetail.save.messages.join(' '));
      } else {
        toast.success(o365ActiveUserDetail.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365ActiveUserDetailMessages());
    }
  }, [o365ActiveUserDetail.save.messages]);

  useEffect(() => {
    if (+id > 0 && o365ActiveUserDetail.getById.data) {
      const data = o365ActiveUserDetail.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365ActiveUserDetail.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365ActiveUserDetailById(+id));
    }
    return () => {
      dispatch(clearO365ActiveUserDetailGetById());
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
        {o365ActiveUserDetail.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365ActiveUserDetail.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365ActiveUserDetail"
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
                  <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
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
                    className="m-0"
                    label="User Principal Name"
                    rules={[{ type: 'email', max: 510 }]}
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
                    className="m-0"
                    label="Deleted Date"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Assigned Products</label>
                  <Form.Item
                    name="assigned_products"
                    className="m-0"
                    label="Assigned Products"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Exchange Last Activity Date</label>
                  <Form.Item
                    name="exchange_last_activity_date"
                    label="Exchange Last Activity Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">OneDrive Last Activity Date</label>
                  <Form.Item
                    name="one_drive_last_activity_date"
                    label="'OneDrive Last Activity Date'"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SharePoint Last Activity Date</label>
                  <Form.Item
                    name="share_point_last_activity_date"
                    label="SharePoint Last Activity Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Skype For Business Last Activity Date</label>
                  <Form.Item
                    name="skype_for_business_last_activity_date"
                    label="Skype For Business Last Activity Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Yammer Last Activity Date</label>
                  <Form.Item
                    name="yammer_last_activity_date"
                    label="'Yammer Last Activity Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Teams Last Activity Date</label>
                  <Form.Item
                    name="teams_last_activity_date"
                    label="Teams Last Activity Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Exchange License Assign Date</label>
                  <Form.Item
                    name="exchange_license_assign_date"
                    label="Exchange License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">OneDrive License Assign Date</label>
                  <Form.Item
                    name="one_drive_license_assign_date"
                    label="OneDrive License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SharePoint License Assign Date</label>
                  <Form.Item
                    name="share_point_license_assign_date"
                    label="SharePoint License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Skype For Business License Assign Date</label>
                  <Form.Item
                    name="skype_for_business_license_assign_date"
                    label="Skype For Business License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Yammer License Assign Date</label>
                  <Form.Item
                    name="yammer_license_assign_date"
                    label="Yammer License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Teams License Assign Date</label>
                  <Form.Item
                    name="teams_license_assign_date"
                    label="Teams License Assign Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
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
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_exchange_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has Exchange License</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_one_drive_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has OneDrive License</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_share_point_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has SharePoint License</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="has_skype_for_business_license"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has Skype For Business License</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_yammer_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has Yammer License</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_teams_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Has Teams License</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365ActiveUserDetail.save.loading}
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
export default AddO365ActiveUserDetailModal;
