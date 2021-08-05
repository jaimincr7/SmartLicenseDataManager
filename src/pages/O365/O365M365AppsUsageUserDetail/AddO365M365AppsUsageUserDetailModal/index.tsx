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
import { IAddO365M365AppsUsageUserDetailProps } from './addO365M365AppsUsageUserDetail.model';
import {
  o365M365AppsUsageUserDetailSelector,
  clearO365M365AppsUsageUserDetailGetById,
  clearO365M365AppsUsageUserDetailMessages,
} from '../../../../store/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.reducer';
import {
  getO365M365AppsUsageUserDetailById,
  saveO365M365AppsUsageUserDetail,
} from '../../../../store/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.action';
import { IO365M365AppsUsageUserDetail } from '../../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.model';
import { validateMessages } from '../../../../common/constants/common';
import moment from 'moment';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';

const { Option } = Select;

const AddO365M365AppsUsageUserDetailModal: React.FC<IAddO365M365AppsUsageUserDetailProps> = (
  props
) => {
  const o365M365AppsUsageUserDetail = useAppSelector(o365M365AppsUsageUserDetailSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}
        <BreadCrumbs pageName={Page.O365M365AppsUsageUserDetail} level={1} />{' '}
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IO365M365AppsUsageUserDetail = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    report_refresh_date: null,
    user_principal_name: '',
    last_activation_date: null,
    last_activity_date: null,
    report_period: null,
    is_active_on_windows: false,
    is_active_on_mac: false,
    is_active_on_mobile: false,
    is_active_on_web: false,
    is_active_on_outlook: false,
    is_active_on_word: false,
    is_active_on_excel: false,
    is_active_on_power_point: false,
    is_active_on_one_note: false,
    is_active_on_teams: false,
    is_active_on_outlook_windows: false,
    is_active_on_word_windows: false,
    is_active_on_excel_windows: false,
    is_active_on_power_point_windows: false,
    is_active_on_one_note_windows: false,
    is_active_on_teams_windows: false,
    is_active_on_outlook_mac: false,
    is_active_on_word_mac: false,
    is_active_on_excel_mac: false,
    is_active_on_power_point_mac: false,
    is_active_on_one_note_mac: false,
    is_active_on_teams_mac: false,
    is_active_on_outlook_mobile: false,
    is_active_on_word_mobile: false,
    is_active_on_excel_mobile: false,
    is_active_on_power_point_mobile: false,
    is_active_on_one_note_mobile: false,
    is_active_on_teams_mobile: false,
    is_active_on_outlook_web: false,
    is_active_on_word_web: false,
    is_active_on_excel_web: false,
    is_active_on_power_point_web: false,
    is_active_on_one_note_web: false,
    is_active_on_teams_web: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IO365M365AppsUsageUserDetail = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveO365M365AppsUsageUserDetail(inputValues));
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

  const fillValuesOnEdit = async (data: IO365M365AppsUsageUserDetail) => {
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

        last_activation_date: _.isNull(data.last_activation_date)
          ? null
          : moment(data.last_activation_date),
        last_activity_date: _.isNull(data.last_activity_date)
          ? null
          : moment(data.last_activity_date),
        report_period: data.report_period,
        is_active_on_windows: data.is_active_on_windows,
        is_active_on_mac: data.is_active_on_mac,
        is_active_on_mobile: data.is_active_on_mobile,
        is_active_on_web: data.is_active_on_web,
        is_active_on_outlook: data.is_active_on_outlook,
        is_active_on_word: data.is_active_on_word,
        is_active_on_excel: data.is_active_on_excel,
        is_active_on_power_point: data.is_active_on_power_point,
        is_active_on_one_note: data.is_active_on_one_note,
        is_active_on_teams: data.is_active_on_teams,
        is_active_on_outlook_windows: data.is_active_on_outlook_windows,
        is_active_on_word_windows: data.is_active_on_word_windows,
        is_active_on_excel_windows: data.is_active_on_excel_windows,
        is_active_on_power_point_windows: data.is_active_on_power_point_windows,
        is_active_on_one_note_windows: data.is_active_on_one_note_windows,
        is_active_on_teams_windows: data.is_active_on_teams_windows,
        is_active_on_outlook_mac: data.is_active_on_outlook_mac,
        is_active_on_word_mac: data.is_active_on_word_mac,
        is_active_on_excel_mac: data.is_active_on_excel_mac,
        is_active_on_power_point_mac: data.is_active_on_power_point_mac,
        is_active_on_one_note_mac: data.is_active_on_one_note_mac,
        is_active_on_teams_mac: data.is_active_on_teams_mac,
        is_active_on_outlook_mobile: data.is_active_on_outlook_mobile,
        is_active_on_word_mobile: data.is_active_on_word_mobile,
        is_active_on_excel_mobile: data.is_active_on_excel_mobile,
        is_active_on_power_point_mobile: data.is_active_on_power_point_mobile,
        is_active_on_one_note_mobile: data.is_active_on_one_note_mobile,
        is_active_on_teams_mobile: data.is_active_on_teams_mobile,
        is_active_on_outlook_web: data.is_active_on_outlook_web,
        is_active_on_word_web: data.is_active_on_word_web,
        is_active_on_excel_web: data.is_active_on_excel_web,
        is_active_on_power_point_web: data.is_active_on_power_point_web,
        is_active_on_one_note_web: data.is_active_on_one_note_web,
        is_active_on_teams_web: data.is_active_on_teams_web,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (o365M365AppsUsageUserDetail.save.messages.length > 0) {
      if (o365M365AppsUsageUserDetail.save.hasErrors) {
        toast.error(o365M365AppsUsageUserDetail.save.messages.join(' '));
      } else {
        toast.success(o365M365AppsUsageUserDetail.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearO365M365AppsUsageUserDetailMessages());
    }
  }, [o365M365AppsUsageUserDetail.save.messages]);

  useEffect(() => {
    if (+id > 0 && o365M365AppsUsageUserDetail.getById.data) {
      const data = o365M365AppsUsageUserDetail.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365M365AppsUsageUserDetail.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getO365M365AppsUsageUserDetailById(+id));
    }
    return () => {
      dispatch(clearO365M365AppsUsageUserDetailGetById());
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
        {o365M365AppsUsageUserDetail.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={o365M365AppsUsageUserDetail.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addO365M365AppsUsageUserDetail"
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
                  <label className="label">Last Activation Date</label>
                  <Form.Item
                    name="last_activation_date"
                    label="Last Activation Date"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" disabledDate={disabledDate} />
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
                  <Form.Item name="is_active_on_windows" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Windows</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Mac</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_mobile" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Mobile</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Web</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_outlook" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Outlook</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Word</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Excel</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_power_point"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on PowerPoint</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_one_note" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on OneNote</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Teams</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_outlook_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Outlook (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_word_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Word (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_excel_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Excel (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_power_point_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on PowerPoint (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_one_note_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on OneNote (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_teams_windows"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Teams (Windows)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_outlook_mac"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Outlook (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Word (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Excel (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_power_point_mac"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on PowerPoint (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_one_note_mac"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on OneNote (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Teams (Mac)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_outlook_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Outlook (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_word_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Word (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_excel_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Excel (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_power_point_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on PowerPoint (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_one_note_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on OneNote (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_teams_mobile"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Teams (Mobile)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_outlook_web"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Outlook (Web)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Word (Web)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Excel (Web)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_power_point_web"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on PowerPoint (Web)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="is_active_on_one_note_web"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on OneNote (Web)</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Active on Teams (Web)</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365M365AppsUsageUserDetail.save.loading}
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
export default AddO365M365AppsUsageUserDetailModal;
