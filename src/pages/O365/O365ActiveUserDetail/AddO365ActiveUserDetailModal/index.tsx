import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
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

const AddO365ActiveUserDetailModal: React.FC<IAddO365ActiveUserDetailProps> = (props) => {
  const o365ActiveUserDetail = useAppSelector(o365ActiveUserDetailSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.O365ActiveUserDetail} level={1} />
      </>
    );
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
    deleted_date: null,
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
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: IO365ActiveUserDetail = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.report_refresh_date = passDateToApi(inputValues.report_refresh_date, true);
    inputValues.exchange_last_activity_date = passDateToApi(
      inputValues.exchange_last_activity_date,
      true
    );
    inputValues.one_drive_last_activity_date = passDateToApi(
      inputValues.one_drive_last_activity_date,
      true
    );
    inputValues.share_point_last_activity_date = passDateToApi(
      inputValues.share_point_last_activity_date,
      true
    );
    inputValues.skype_for_business_last_activity_date = passDateToApi(
      inputValues.skype_for_business_last_activity_date,
      true
    );
    inputValues.yammer_last_activity_date = passDateToApi(
      inputValues.yammer_last_activity_date,
      true
    );
    inputValues.teams_last_activity_date = passDateToApi(
      inputValues.teams_last_activity_date,
      true
    );
    inputValues.exchange_license_assign_date = passDateToApi(
      inputValues.exchange_license_assign_date,
      true
    );
    inputValues.one_drive_license_assign_date = passDateToApi(
      inputValues.one_drive_license_assign_date,
      true
    );
    inputValues.share_point_license_assign_date = passDateToApi(
      inputValues.share_point_license_assign_date,
      true
    );
    inputValues.skype_for_business_license_assign_date = passDateToApi(
      inputValues.skype_for_business_license_assign_date,
      true
    );
    inputValues.yammer_license_assign_date = passDateToApi(
      inputValues.yammer_license_assign_date,
      true
    );
    inputValues.teams_license_assign_date = passDateToApi(
      inputValues.teams_license_assign_date,
      true
    );
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveO365ActiveUserDetail(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        o365ActiveUserDetail.search.tableName
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
          : forEditModal(data.report_refresh_date),
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
          : forEditModal(data.exchange_last_activity_date),
        one_drive_last_activity_date: _.isNull(data.one_drive_last_activity_date)
          ? null
          : forEditModal(data.one_drive_last_activity_date),
        share_point_last_activity_date: _.isNull(data.share_point_last_activity_date)
          ? null
          : forEditModal(data.share_point_last_activity_date),
        skype_for_business_last_activity_date: _.isNull(data.skype_for_business_last_activity_date)
          ? null
          : forEditModal(data.skype_for_business_last_activity_date),
        yammer_last_activity_date: _.isNull(data.yammer_last_activity_date)
          ? null
          : forEditModal(data.yammer_last_activity_date),
        teams_last_activity_date: _.isNull(data.teams_last_activity_date)
          ? null
          : forEditModal(data.teams_last_activity_date),
        exchange_license_assign_date: _.isNull(data.exchange_license_assign_date)
          ? null
          : forEditModal(data.exchange_license_assign_date),
        one_drive_license_assign_date: _.isNull(data.one_drive_license_assign_date)
          ? null
          : forEditModal(data.one_drive_license_assign_date),
        share_point_license_assign_date: _.isNull(data.share_point_license_assign_date)
          ? null
          : forEditModal(data.share_point_license_assign_date),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        skype_for_business_license_assign_date: _.isNull(
          data.skype_for_business_license_assign_date
        )
          ? null
          : forEditModal(data.skype_for_business_license_assign_date),
        yammer_license_assign_date: _.isNull(data.yammer_license_assign_date)
          ? null
          : forEditModal(data.yammer_license_assign_date),
        teams_license_assign_date: _.isNull(data.teams_last_activity_date)
          ? null
          : forEditModal(data.teams_last_activity_date),
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
    if (+id > 0 && o365ActiveUserDetail.getById.data) {
      const data = o365ActiveUserDetail.getById.data;
      fillValuesOnEdit(data);
    }
  }, [o365ActiveUserDetail.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getO365ActiveUserDetailById(+id));
    }
    return () => {
      dispatch(clearO365ActiveUserDetailGetById());
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'assigned_products']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Assigned Products</Checkbox>
                    </Form.Item>
                  ) : (
                    'Assigned Products'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'exchange_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exchange Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange Last Activity Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'one_drive_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OneDrive Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'OneDrive Last Activity Date'
                  )}
                  <Form.Item
                    name="one_drive_last_activity_date"
                    label="OneDrive Last Activity Date"
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
                      name={['checked', 'share_point_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>SharePoint Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'SharePoint Last Activity Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'skype_for_business_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Skype For Business Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Skype For Business Last Activity Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'yammer_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Yammer Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Yammer Last Activity Date'
                  )}
                  <Form.Item
                    name="yammer_last_activity_date"
                    label="Yammer Last Activity Date"
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
                      name={['checked', 'teams_last_activity_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Teams Last Activity Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Teams Last Activity Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'exchange_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exchange License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'one_drive_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OneDrive License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'OneDrive License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'share_point_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>SharePoint License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'SharePoint License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'skype_for_business_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Skype For Business License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Skype For Business License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'yammer_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Yammer License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Yammer License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'teams_license_assign_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Teams License Assign Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Teams License Assign Date'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_deleted']} valuePropName="checked" noStyle>
                      <Checkbox>Is Deleted</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Deleted'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_exchange_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_exchange_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has Exchange License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has Exchange License'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_one_drive_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_one_drive_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has One Drive License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has One Drive License'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_share_point_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_share_point_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has Share Point License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has Share Point License'
                  )}
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_skype_for_business_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has Skype for Business License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has Skype for Business License'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_yammer_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_yammer_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has Yammer License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has Yammer License'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="has_teams_license" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'has_teams_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Has Teams License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Has Teams License'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={o365ActiveUserDetail.save.loading || commonLookups.save.loading}
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
