import { Button, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICronData } from '../../../../services/master/cron/cron.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getSpsApiGroupLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { updateMultiple } from '../../../../store/common/common.action';
import { getCronById, saveCron } from '../../../../store/master/cron/cron.action';
import {
  clearCronGetById,
  clearCronMessages,
  cronSelector,
} from '../../../../store/master/cron/cron.reducer';
import { IAddCronProps } from './addCron.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddCronModal: React.FC<IAddCronProps> = (props) => {
  const cron = useAppSelector(cronSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const {
    id,
    showModal,
    handleModalClose,
    filterKeys,
    refreshDataTable,
    isMultiple,
    valuesForSelection,
    setDropDownFlag,
  } = props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Cron} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICronData = {
    id: null,
    api_group_id: null,
    company_id: null,
    bu_id: null,
    tenant_id: null,
    frequency_type: 'Weekly',
    start_date: moment().add(5, 'minutes'),
    start_schedular: true,
    date_added: moment(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICronData = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCron(inputValues));
    } else {
      setDropDownFlag(false);
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cron.search.tableName,
        true
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

  const fillValuesOnEdit = async (data: ICronData) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        api_group_id: _.isNull(data.api_group_id) ? null : data.api_group_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        frequency_type: data.frequency_type,
        start_date: _.isNull(data.start_date) ? null : moment(data.start_date),
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
        start_schedular: data.status === 'Running' ? true : false,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cron.save.messages.length > 0) {
      if (cron.save.hasErrors) {
        toast.error(cron.save.messages.join(' '));
      } else {
        toast.success(cron.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCronMessages());
    }
  }, [cron.save.messages]);

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
    if (+id > 0 && cron.getById.data) {
      const data = cron.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cron.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getSpsApiGroupLookup());
    //dispatch(getFrequencyDay());
    if (+id > 0) {
      dispatch(getCronById(+id));
    }
    return () => {
      dispatch(clearCronGetById());
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
          date_added:
            filterKeys?.filter_keys?.date_added?.length == 1
              ? moment(filterKeys.filter_keys.date_added[0])
              : moment(),
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
        {cron.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cron.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addCron"
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
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: !isMultiple }]}
                  >
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
                  <Form.Item
                    name="bu_id"
                    className="m-0"
                    label="BU"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      onChange={handleBUChange}
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
                    <Form.Item name={['checked', 'api_group_id']} valuePropName="checked" noStyle>
                      <Checkbox>API Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Group'
                  )}
                  <Form.Item
                    name="api_group_id"
                    className="m-0"
                    label="API Group"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      loading={commonLookups.spsApiGroups.loading}
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
                      {commonLookups.spsApiGroups.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'frequency_type']} valuePropName="checked" noStyle>
                      <Checkbox>Frequency Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Frequency Type'
                  )}
                  <Form.Item
                    name="frequency_type"
                    label="Frequency Type"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
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
                      <Option value="Daily">Daily</Option>
                      <Option value="Weekly">Weekly</Option>
                      <Option value="Monthly">Monthly</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'cron_frequency_day']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Frequency Day</Checkbox>
                    </Form.Item>
                  ) : (
                    'Frequency Day'
                  )}
                  <Form.Item
                    name="cron_frequency_day"
                    className="m-0"
                    label="Frequency Day"
                    rules={[{ required: !isMultiple && week !== 'Daily' }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      disabled={week == 'Daily'}
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={cron.FrequencyDay.loading}
                    >
                      {week == 'Weekly' ? (
                        cron.FrequencyDay.week.map((option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {`${option.id} (${option.name})`}
                          </Option>
                        ))
                      ) : week == 'Monthly' ? (
                        cron.FrequencyDay.month.map((option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Select>
                  </Form.Item>
                </div>
              </Col> */}
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'start_date']} valuePropName="checked" noStyle>
                      <Checkbox>Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Start Date'
                  )}
                  <Form.Item
                    name="start_date"
                    label="Start Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker
                      showTime
                      className="form-control w-100"
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    />
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
                  <Form.Item
                    name="date_added"
                    label="Date Added"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              {isMultiple === true ? (
                <></>
              ) : (
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="start_schedular" className="m-0 mr-1" valuePropName="checked">
                      <Switch className="form-control" />
                    </Form.Item>
                    {isMultiple ? (
                      <Form.Item
                        name={['checked', 'start_schedular']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Enable</Checkbox>
                      </Form.Item>
                    ) : (
                      'Enable'
                    )}
                  </div>
                </Col>
              )}
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cron.save.loading || commonLookups.save.loading}
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
export default AddCronModal;
