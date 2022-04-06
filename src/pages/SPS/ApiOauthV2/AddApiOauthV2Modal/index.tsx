import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiOauthV2 } from '../../../../services/sps/apiOauthV2/apiOauthV2.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiOauthV2ById,
  saveSpsApiOauthV2,
} from '../../../../store/sps/apiOauthV2/apiOauthV2.action';
import {
  clearSpsApiOauthV2GetById,
  clearSpsApiOauthV2Messages,
  spsApiOauthV2Selector,
} from '../../../../store/sps/apiOauthV2/apiOauthV2.reducer';
import { IAddSpsApiOauthV2Props } from './addApiOauthV2.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getBULookup,
  getCompanyLookup,
  getSpsApiBaseUrl,
  getSpsApiTypeLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { getSpsApiInjectionParamV2 } from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.action';
import { spsApiInjectionParamV2Selector } from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.reducer';
import {
  getSpsApiInjectionValueV2ByOauthId,
  saveSpsApiInjectionValueParamV2,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.action';
import {
  clearSpsApiInjectionValueParamV2GetById,
  spsApiInjectionValueParamV2Selector,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const AddSpsApiOauthV2Modal: React.FC<IAddSpsApiOauthV2Props> = (props) => {
  const spsApiOauthV2 = useAppSelector(spsApiOauthV2Selector);
  const spsApiInjectionParamV2 = useAppSelector(spsApiInjectionParamV2Selector);
  const spsApiInjectionValueV2 = useAppSelector(spsApiInjectionValueParamV2Selector);
  const [records, setRecords] = useState([]);
  const globalFilters = useAppSelector(globalSearchSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const {
    id,
    showModal,
    handleModalClose,
    refreshDataTable,
    isMultiple,
    valuesForSelection,
    typeId,
  } = props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SpsApiOauthV2} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiOauthV2 = {
    company_id: null,
    bu_id: null,
    tenant_id: null,
    api_type_id: typeId ? +typeId : null,
    base_url_id: null,
    consent: true,
    active: true,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiOauthV2 = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      if (+id > 0) {
        const arr = [];
        records.map((options, index) => {
          const obj = {
            injection_param_id: options.id,
            value:
              options.name == '@BASEURL'
                ? commonLookups.spsApiBaseUrl.data.filter(
                    (data) => data.id == values?.base_url_id
                  )[0]?.name
                : values.value[index].value,
          };
          arr.push(obj);
        });
        const finalObj = {
          oauth_id: +id,
          injection_values: arr,
        };
        dispatch(saveSpsApiInjectionValueParamV2(finalObj));
      }
      dispatch(saveSpsApiOauthV2(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiOauthV2.search.tableName
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

  const fillValuesOnInjectionValue = () => {
    const dummyRecords = _.cloneDeep(spsApiInjectionParamV2.getInjectionParam?.data);
    dummyRecords.map((x) => {
      const arrRec = [...spsApiInjectionValueV2.getByOauthId.data];
      const rec = arrRec?.filter((i) => i.injection_param_id == x.id);
      const data = spsApiOauthV2.getById.data;
      x.value =
        x.name == '@BASEURL'
          ? commonLookups.spsApiBaseUrl.data.filter((data1) => data1.id == data?.base_url_id)[0]
              ?.name
          : rec[0]?.value;
    });
    setRecords(dummyRecords);
    setTimeout(() => {
      form.resetFields();
    });
  };

  const fillValuesOnEdit = async (data: ISpsApiOauthV2) => {
    if (data) {
      dispatch(getSpsApiInjectionParamV2(data.api_type_id));
      if (data.tenant_id) {
        await dispatch(getCompanyLookup(data.tenant_id));
      }
      if (data.company_id) {
        await dispatch(getBULookup(data.company_id));
      }
      initialValues = {
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        api_type_id: _.isNull(data.api_type_id) ? null : data.api_type_id,
        base_url_id: _.isNull(data.base_url_id) ? null : data.base_url_id,
        consent: data.consent,
        active: data.active,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiInjectionParamV2.getInjectionParam.data?.length > 0 && +id > 0)
      setRecords(spsApiInjectionParamV2.getInjectionParam?.data);
  }, [spsApiInjectionParamV2.getInjectionParam?.data]);

  useEffect(() => {
    if (spsApiOauthV2.save.messages.length > 0) {
      if (spsApiOauthV2.save.hasErrors) {
        toast.error(spsApiOauthV2.save.messages.join(' '));
      } else {
        toast.success(spsApiOauthV2.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiOauthV2Messages());
    }
  }, [spsApiOauthV2.save.messages]);

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
    if (+id > 0 && spsApiOauthV2.getById.data) {
      const data = spsApiOauthV2.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiOauthV2.getById.data]);

  useEffect(() => {
    if (
      +id > 0 &&
      spsApiInjectionValueV2.getByOauthId.data &&
      spsApiInjectionParamV2.getInjectionParam?.data
    ) {
      fillValuesOnInjectionValue();
    }
  }, [spsApiInjectionValueV2.getByOauthId.data, spsApiInjectionParamV2.getInjectionParam?.data]);

  useEffect(() => {
    dispatch(getSpsApiTypeLookup());
    dispatch(getSpsApiBaseUrl());
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getSpsApiOauthV2ById(+id));
      dispatch(getSpsApiInjectionValueV2ByOauthId(+id));
    }
    return () => {
      dispatch(clearSpsApiOauthV2GetById());
      setRecords([]);
      dispatch(clearSpsApiInjectionValueParamV2GetById());
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

  const removeRecord = (value) => {
    const dummyR = records.filter((data) => data.id !== value);
    setRecords(dummyR);
  };

  const onBaseUrlChange = (value, event) => {
    if (+id > 0 && spsApiOauthV2.getById.data) {
      const dummyRecords = _.cloneDeep(records);
      dummyRecords.map((data) => {
        if (data.name == '@BASEURL') {
          data.value = event.children;
        }
      });
      setRecords(dummyRecords);
    }
  };

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
        {spsApiOauthV2.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiOauthV2.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiOauthV2"
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
                    <Form.Item name={['checked', 'api_type_id']} valuePropName="checked" noStyle>
                      <Checkbox>API Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Type'
                  )}
                  <Form.Item
                    name="api_type_id"
                    className="m-0"
                    label="API Type"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.spsApiTypes.loading}
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
                      {commonLookups.spsApiTypes.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'base_url_id']} valuePropName="checked" noStyle>
                      <Checkbox>Base Url</Checkbox>
                    </Form.Item>
                  ) : (
                    'Base Url'
                  )}
                  <Form.Item
                    name="base_url_id"
                    className="m-0"
                    label="Base Url Id"
                    rules={[
                      {
                        required: records.filter((data) => data.name == '@BASEURL')?.length > 0,
                        message: 'Base Url is required',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onSelect={(value, event) => {
                        onBaseUrlChange(value, event);
                      }}
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.spsApiBaseUrl.loading}
                    >
                      {commonLookups.spsApiBaseUrl.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="consent" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'consent']} valuePropName="checked" noStyle>
                      <Checkbox>Consent</Checkbox>
                    </Form.Item>
                  ) : (
                    'Consent'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="active" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'active']} valuePropName="checked" noStyle>
                      <Checkbox>Active</Checkbox>
                    </Form.Item>
                  ) : (
                    'Active'
                  )}
                </div>
              </Col>
            </Row>
            <br />
            <hr />
            {records?.length > 0 &&
              +id > 0 &&
              (records || []).map((option, index) => (
                <>
                  <br />
                  <Row gutter={[30, 15]} className="form-label-hide" key={index}>
                    <Col xs={24} sm={12} md={6}>
                      <label className="label w-100">Injection Param</label>
                      <Form.Item
                        name={['inj', index, 'inj']}
                        initialValue={option.id}
                        label="Injection Param"
                        className="m-0"
                      >
                        {option.name}
                        <Input className="form-control" value={option.id} hidden={true} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <label className="label w-100">Value</label>
                      <Form.Item
                        name={['value', index, 'value']}
                        label="Value"
                        className="m-0"
                        initialValue={option.value}
                        rules={[{ required: true && option.name !== '@BASEURL' }]}
                      >
                        {option.name !== '@BASEURL' ? (
                          <Input
                            className="form-control"
                            value={option.value}
                            disabled={option.name == '@BASEURL'}
                          />
                        ) : (
                          <label className="label w-100">{option.value}</label>
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <label className="label w-100"></label>
                      <Button onClick={() => removeRecord(option.id)}>Remove</Button>
                    </Col>
                  </Row>
                </>
              ))}
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiOauthV2.save.loading || commonLookups.save.loading}
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
export default AddSpsApiOauthV2Modal;
