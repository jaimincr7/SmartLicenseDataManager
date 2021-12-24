import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiInjectionParamV2 } from '../../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiInjectionParamV2ById,
  saveSpsApiInjectionParamV2,
} from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.action';
import {
  clearSpsApiInjectionParamV2GetById,
  clearSpsApiInjectionParamV2Messages,
  spsApiInjectionParamV2Selector,
} from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.reducer';
import { IAddSpsApiInjectionParamV2Props } from './addApiInjectionParamV2.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiTypeLookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiInjectionParamV2Modal: React.FC<IAddSpsApiInjectionParamV2Props> = (
  props
) => {
  const spsApiInjectionParamV2 = useAppSelector(spsApiInjectionParamV2Selector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiInjectionParamV2} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiInjectionParamV2 = {
    param: '',
    param_id: '',
    is_masked: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiInjectionParamV2 = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiInjectionParamV2(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiInjectionParamV2.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiInjectionParamV2) => {
    const typeIds = [];
    data.sps_api_token_config_options_v2_with_api_types.map(x => { typeIds.push(x.api_type_id); });
    if (data) {
      initialValues = {
        param: data.param,
        param_id: data.param_id,
        is_masked: data.is_masked,
        api_type_ids: _.isNull(typeIds) ? null : typeIds,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiInjectionParamV2.save.messages.length > 0) {
      if (spsApiInjectionParamV2.save.hasErrors) {
        toast.error(spsApiInjectionParamV2.save.messages.join(' '));
      } else {
        toast.success(spsApiInjectionParamV2.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiInjectionParamV2Messages());
    }
  }, [spsApiInjectionParamV2.save.messages]);

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
    if (+id > 0 && spsApiInjectionParamV2.getById.data) {
      const data = spsApiInjectionParamV2.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiInjectionParamV2.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiTypeLookup());
    if (+id > 0) {
      dispatch(getSpsApiInjectionParamV2ById(+id));
    }
    return () => {
      dispatch(clearSpsApiInjectionParamV2GetById());
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
        {spsApiInjectionParamV2.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiInjectionParamV2.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiInjectionParamV2"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
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
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'type']} valuePropName="checked" noStyle>
                      <Checkbox>Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Type'
                  )}
                  <Form.Item
                    name="type"
                    label="Type"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'api_type_ids']} valuePropName="checked" noStyle>
                      <Checkbox>API Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Type'
                  )}
                  <Form.Item
                    name="api_type_ids"
                    className="m-0"
                    label="API Type"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      mode="multiple"
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
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_env_var" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_env_var']} valuePropName="checked" noStyle>
                      <Checkbox>Is Env Var</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Env Var'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiInjectionParamV2.save.loading || commonLookups.save.loading}
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
export default AddSpsApiInjectionParamV2Modal;
