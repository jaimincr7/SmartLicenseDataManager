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
import { IAddO365ActivationsUserDetailProps } from './addO365ActivationsUserDetail.model';
import {
  o365ActivationsUserDetailSelector,
  clearO365ActivationsUserDetailGetById,
  clearO365ActivationsUserDetailMessages,
} from '../../../../store/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.reducer';
import {
  getO365ActivationsUserDetailById,
  saveO365ActivationsUserDetail,
} from '../../../../store/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.action';
import { IO365ActivationsUserDetail } from '../../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.model';
import { validateMessages } from '../../../../common/constants/common';
import moment from 'moment';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';

const { Option } = Select;

const AddO365ActivationsUserDetailModal: React.FC<IAddO365ActivationsUserDetailProps> = (props) => {
  const o365ActivationsUserDetail = useAppSelector(o365ActivationsUserDetailSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}
        <BreadCrumbs pageName={Page.O365ActivationsUserDetail} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365ActivationsUserDetail = {
    company_id: null,
    bu_id: null,
    report_refresh_date: null,
    user_principal_name: '',
    display_name: '',
    product_type: '',
    last_activated_date: null,
    window: null,
    mac: null,
    windows_10_mobile: null,
    ios: null,
    android: null,
    activated_on_shared_computer: false,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IO365ActivationsUserDetail = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365ActivationsUserDetail(inputValues));
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

  const fillValuesOnEdit = async (data: IO365ActivationsUserDetail) => {
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
        product_type: data.product_type,
        last_activated_date: _.isNull(data.last_activated_date)
          ? null
          : moment(data.last_activated_date),
        window: data.window,
        mac: data.mac,
        windows_10_mobile: data.windows_10_mobile,
        ios: data.ios,
        android: data.android,
        activated_on_shared_computer: data.activated_on_shared_computer,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365ActivationsUserDetail.save.messages.length > 0) {
      if (o365ActivationsUserDetail.save.hasErrors) {
        toast.error(o365ActivationsUserDetail.save.messages.join(' '));
      } else {
        toast.success(o365ActivationsUserDetail.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365ActivationsUserDetailMessages());
    }
  }, [o365ActivationsUserDetail.save.messages]);

  useEffect(() => {
    if (+id > 0 && o365ActivationsUserDetail.getById.data) {
      const data = o365ActivationsUserDetail.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365ActivationsUserDetail.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365ActivationsUserDetailById(+id));
    }
    return () => {
      dispatch(clearO365ActivationsUserDetailGetById());
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
        {o365ActivationsUserDetail.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365ActivationsUserDetail.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365ActivationsUserDetail"
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
                  <label className="label">Product Type</label>
                  <Form.Item
                    name="product_type"
                    className="m-0"
                    label="Product Type"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Activated Date</label>
                  <Form.Item name="last_activated_date" label="Last Activated Date" className="m-0">
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Window</label>
                  <Form.Item
                    name="window"
                    label="Window"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Mac</label>
                  <Form.Item name="mac" label="Mac" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Windows 10 Mobile</label>
                  <Form.Item
                    name="windows_10_mobile"
                    label="Windows 10 Mobile"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">iOS</label>
                  <Form.Item name="ios" label="iOS" className="m-0" rules={[{ type: 'number' }]}>
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Android</label>
                  <Form.Item
                    name="android"
                    label="Android"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="activated_on_shared_computer"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Activated on Shared Computer</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365ActivationsUserDetail.save.loading}
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
export default AddO365ActivationsUserDetailModal;
