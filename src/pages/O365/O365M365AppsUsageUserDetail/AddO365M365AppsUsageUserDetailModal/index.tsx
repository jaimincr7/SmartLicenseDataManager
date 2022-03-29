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
import { ILookup } from '../../../../services/common/common.model';
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
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import {
  forDisableDate,
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const AddO365M365AppsUsageUserDetailModal: React.FC<IAddO365M365AppsUsageUserDetailProps> = (
  props
) => {
  const o365M365AppsUsageUserDetail = useAppSelector(o365M365AppsUsageUserDetailSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IO365M365AppsUsageUserDetail = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.report_refresh_date = passDateToApi(inputValues.report_refresh_date, true);
    inputValues.last_activity_date = passDateToApi(inputValues.last_activity_date, true);
    inputValues.last_activation_date = passDateToApi(inputValues.last_activation_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveO365M365AppsUsageUserDetail(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        o365M365AppsUsageUserDetail.search.tableName
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
          : forEditModal(data.report_refresh_date),
        user_principal_name: data.user_principal_name,

        last_activation_date: _.isNull(data.last_activation_date)
          ? null
          : forEditModal(data.last_activation_date),
        last_activity_date: _.isNull(data.last_activity_date)
          ? null
          : forEditModal(data.last_activity_date),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
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
    if (+id > 0 && o365M365AppsUsageUserDetail.getById.data) {
      const data = o365M365AppsUsageUserDetail.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365M365AppsUsageUserDetail.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getO365M365AppsUsageUserDetailById(+id));
    }
    return () => {
      dispatch(clearO365M365AppsUsageUserDetailGetById());
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_activation_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Activation Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Activation Date'
                  )}
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
                    <InputNumber min={0} className="form-control w-100" />
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
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_windows" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Windows'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on MAC'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_mobile" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Mobile'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Web'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_outlook" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_outlook']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Outlook</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Outlook'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_word']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Word</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Word'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_excel']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Excel</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Excel'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_power_point']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Power Point</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Power Point'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_one_note" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_one_note']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on One Note</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on One Note'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_teams']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Teams</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Teams'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_outlook_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Outlook Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Outlook Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_word_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Word Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Word Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_excel_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Excel Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Excel Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_power_point_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Power Point Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Power Point Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_one_note_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on One Note Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on One Note Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_teams_windows']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Teams Windows</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Teams Windows'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_outlook_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Outlook MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Outlook MAC'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_word_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Word MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Word MAC'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_excel_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Ative on Excel MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Ative on Excel MAC'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_power_point_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Power Point MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Power Point MAC'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_one_note_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on One Note MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on One Note MAC'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams_mac" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_teams_mac']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Teams MAC</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Teams MAC'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_outlook_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Outlook Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Outlook Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_word_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Word Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Word Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_excel_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Excel Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Excel Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_power_point_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Power Point Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Power Point Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_one_note_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on One Note Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on One Note Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_teams_mobile']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Teams Mobile</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Teams Mobile'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_outlook_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Outlook Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Outlook Web'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_word_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_word_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Word Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Word Web'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_excel_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_excel_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Excel Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Excel Web'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_power_point_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Actie on Power Point Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Actie on Power Point Web'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_one_note_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on One Note Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on One Note Web'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active_on_teams_web" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_active_on_teams_web']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Active on Teams Web</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active on Teams Web'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365M365AppsUsageUserDetail.save.loading || commonLookups.save.loading}
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
