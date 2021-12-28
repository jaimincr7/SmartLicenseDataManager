import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiUrlInjectionV2Lookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import commonService from '../../../../services/common/common.service';

const { Option } = Select;

const AddSpsApiInjectionValueParamV2Modal: React.FC<IAddSpsApiInjectionValueParamV2Props> = (props) => {
  const spsApiInjectionValueParamV2 = useAppSelector(spsApiInjectionValueParamV2Selector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const [oauthOptions, setOptions] = useState([]);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SpsApiInjectionValueParamV2} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiInjectionValueParamV2 = {
    injection_param_id: null,
    oauth_id: null,
    value: '',
    token: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiInjectionValueParamV2 = {
      ...values,
      id: id ? +id : null,
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

  const fillValuesOnEdit = async (data: ISpsApiInjectionValueParamV2) => {
    if (data) {
      initialValues = {
        injection_param_id: _.isNull(data.injection_param_id) ? null : data.injection_param_id,
        oauth_id: _.isNull(data.oauth_id) ? null : data.oauth_id,
        value: data.value,
        token: data.token,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
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
        toast.success(commonLookups.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [commonLookups.save.messages]);

  useEffect(() => {
    if (+id > 0 && spsApiInjectionValueParamV2.getById.data) {
      const data = spsApiInjectionValueParamV2.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiInjectionValueParamV2.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiUrlInjectionV2Lookup());
    const filterOBJ: any = {
      table_name: "SPS_API_OAUTH_v2",
      column_name: "id",
      filter_keys: {},
      is_column_selection: false,
      current_user: {},
    };
    commonService.getColumnLookup(filterOBJ).then((res) => {
      return res.body.data;
    })
    .then((res) => {
      setOptions(res);
    });

    if (+id > 0) {
      dispatch(getSpsApiInjectionValueParamV2ById(+id));
    }
    return () => {
      dispatch(clearSpsApiInjectionValueParamV2GetById());
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
                    <Form.Item name={['checked', 'injection_param_id']} valuePropName="checked" noStyle>
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
              <Col xs={24} sm={12} md={8}>
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
                      {oauthOptions.map((option: ILookup) => (
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
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'token']} valuePropName="checked" noStyle>
                      <Checkbox>Token</Checkbox>
                    </Form.Item>
                  ) : (
                    'Token'
                  )}
                  <Form.Item
                    name="token"
                    label="Token"
                    className="m-0"
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
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
