import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiInjectionValueParamV2 } from '../../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiInjectionValueParamV2ById,
  saveSpsApiInjectionValueParamV2,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.action';
import {
  clearSpsApiInjectionValueParamV2GetById,
  clearSpsApiInjectionValueParamV2Messages,
  spsApiInjectionValueParamV2Selector,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.reducer';
import { IAddSpsApiInjectionValueParamV2Props } from './addApiInjectionValueParamV2.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getApiTypeV2Lookup,
  getBULookup,
  getCompanyLookup,
  getOAuthV2IdLookup,
  getSpsApiUrlInjectionV2Lookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { getSpsApiOauthV2ById } from '../../../../store/sps/apiOauthV2/apiOauthV2.action';
import {
  clearSpsApiOauthV2,
  spsApiOauthV2Selector,
} from '../../../../store/sps/apiOauthV2/apiOauthV2.reducer';

const { Option } = Select;

const AddSpsApiInjectionValueParamV2Modal: React.FC<IAddSpsApiInjectionValueParamV2Props> = (
  props
) => {
  const spsApiInjectionValueParamV2 = useAppSelector(spsApiInjectionValueParamV2Selector);
  const spsApiOAuthV2 = useAppSelector(spsApiOauthV2Selector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiInjectionValueParamV2} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: any = {
    injection_param_id: null,
    value: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiInjectionValueParamV2 = {
      oauth_id:
        +id > 0 ? spsApiInjectionValueParamV2.getById.data.oauth_id : commonLookups.OauthIdV2.data,
      injection_values: [
        {
          injection_param_id: values.injection_param_id,
          value: values.value,
        },
      ],
    };
    if (!isMultiple) {
      dispatch(saveSpsApiInjectionValueParamV2(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiInjectionValueParamV2.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: any, data2: any) => {
    if (data && data2) {
      if (data.tenant_id) {
        await dispatch(getCompanyLookup(data.tenant_id));
      }
      if (data.company_id) {
        await dispatch(getBULookup(data.company_id));
      }
      if (data.bu_id) {
        const dataDD = {
          tenant_id: data.tenant_id,
          company_id: data.company_id,
          bu_id: data.bu_id,
        };
        await dispatch(getApiTypeV2Lookup(dataDD));
      }
      if (data.api_type_id) {
        await dispatch(getSpsApiUrlInjectionV2Lookup(data.api_type_id));
      }
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        api_type_id: _.isNull(data.api_type_id) ? null : data.api_type_id,
        injection_param_id: _.isNull(data2.injection_param_id) ? null : data2.injection_param_id,
        value: data2.value,
      };
      form.setFieldsValue(initialValues);
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
    const data = {
      tenant_id: form.getFieldValue('tenant_id'),
      company_id: form.getFieldValue('company_id'),
      bu_id: form.getFieldValue('bu_id'),
    };
    dispatch(getApiTypeV2Lookup(data));
  };

  const onApiTypeChange = (e) => {
    dispatch(getSpsApiUrlInjectionV2Lookup(e));
    const data = {
      tenant_id: form.getFieldValue('tenant_id'),
      company_id: form.getFieldValue('company_id'),
      bu_id: form.getFieldValue('bu_id'),
      api_type_id: form.getFieldValue('api_type_id'),
    };
    dispatch(getOAuthV2IdLookup(data));
  };

  useEffect(() => {
    if (spsApiInjectionValueParamV2.save.messages.length > 0) {
      if (spsApiInjectionValueParamV2.save.hasErrors) {
        toast.error(spsApiInjectionValueParamV2.save.messages.join(' '));
      } else {
        toast.success(spsApiInjectionValueParamV2.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiInjectionValueParamV2Messages());
    }
  }, [spsApiInjectionValueParamV2.save.messages]);

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
    if (+id > 0 && spsApiOAuthV2.getById.data) {
      const data = spsApiOAuthV2.getById.data;
      fillValuesOnEdit(data, spsApiInjectionValueParamV2.getById.data);
    }
  }, [spsApiOAuthV2.getById.data]);

  useEffect(() => {
    if (+id > 0 && spsApiInjectionValueParamV2.getById.data) {
      const data = spsApiInjectionValueParamV2.getById.data;
      dispatch(getSpsApiOauthV2ById(data.oauth_id));
    }
  }, [spsApiInjectionValueParamV2.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getSpsApiInjectionValueParamV2ById(+id));
    }
    return () => {
      dispatch(clearSpsApiInjectionValueParamV2GetById());
      dispatch(clearSpsApiOauthV2());
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
        {spsApiInjectionValueParamV2.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiInjectionValueParamV2.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiInjectionValueParamV2"
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
                  <Form.Item
                    name="bu_id"
                    className="m-0"
                    label="BU"
                    rules={[{ required: !isMultiple }]}
                  >
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
                      disabled={commonLookups.ApiTypeV2.data?.length == 0}
                      loading={commonLookups.ApiTypeV2.loading}
                      showSearch
                      onChange={onApiTypeChange}
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
                      {commonLookups.ApiTypeV2.data.map((option: ILookup) => (
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
                      name={['checked', 'injection_param_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Injection URL</Checkbox>
                    </Form.Item>
                  ) : (
                    'Injection URL'
                  )}
                  <Form.Item
                    name="injection_param_id"
                    className="m-0"
                    label="Injection URL"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      disabled={commonLookups.spsApiUrlInjectionV2Lookup.data?.length == 0}
                      loading={commonLookups.spsApiUrlInjectionV2Lookup.loading}
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
                      {commonLookups.spsApiUrlInjectionV2Lookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'oauth_id']} valuePropName="checked" noStyle>
                      <Checkbox>OAuth</Checkbox>
                    </Form.Item>
                  ) : (
                    'OAuth'
                  )}
                  <Form.Item
                    name="oauth_id"
                    className="m-0"
                    label="OAuth"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.spsApiOAuthLookup.loading}
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
                      {commonLookups.spsApiOAuthLookup.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col> */}
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'value']} valuePropName="checked" noStyle>
                      <Checkbox>Value</Checkbox>
                    </Form.Item>
                  ) : (
                    'Value'
                  )}
                  <Form.Item
                    name="value"
                    label="Value"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'token']} valuePropName="checked" noStyle>
                      <Checkbox>Token</Checkbox>
                    </Form.Item>
                  ) : (
                    'Token'
                  )}
                  <Form.Item name="token" label="Token" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col> */}
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiInjectionValueParamV2.save.loading || commonLookups.save.loading}
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
export default AddSpsApiInjectionValueParamV2Modal;
