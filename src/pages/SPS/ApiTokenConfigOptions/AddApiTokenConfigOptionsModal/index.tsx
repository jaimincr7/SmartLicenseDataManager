import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiTokenConfigOptions } from '../../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiTokenConfigOptionsById,
  saveSpsApiTokenConfigOptions,
} from '../../../../store/sps/apiTokenConfigOptions/apiTokenConfigOptions.action';
import {
  clearSpsApiTokenConfigOptionsGetById,
  clearSpsApiTokenConfigOptionsMessages,
  spsApiTokenConfigOptionsSelector,
} from '../../../../store/sps/apiTokenConfigOptions/apiTokenConfigOptions.reducer';
import { IAddSpsApiTokenConfigOptionsProps } from './addApiTokenConfigOptions.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiTypeLookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiTokenConfigOptionsModal: React.FC<IAddSpsApiTokenConfigOptionsProps> = (props) => {
  const spsApiTokenConfigOptions = useAppSelector(spsApiTokenConfigOptionsSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiTokenConfigOptions} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiTokenConfigOptions = {
    name: '',
    value: '',
    type: '',
    api_type_id: null,
    is_env_var: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiTokenConfigOptions = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiTokenConfigOptions(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiTokenConfigOptions.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiTokenConfigOptions) => {
    if (data) {
      initialValues = {
        name: data.name,
        value: data.value,
        type: data.type,
        api_type_id: _.isNull(data.api_type_id) ? null : data.api_type_id,
        is_env_var: data.is_env_var,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiTokenConfigOptions.save.messages.length > 0) {
      if (spsApiTokenConfigOptions.save.hasErrors) {
        toast.error(spsApiTokenConfigOptions.save.messages.join(' '));
      } else {
        toast.success(spsApiTokenConfigOptions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiTokenConfigOptionsMessages());
    }
  }, [spsApiTokenConfigOptions.save.messages]);

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
    if (+id > 0 && spsApiTokenConfigOptions.getById.data) {
      const data = spsApiTokenConfigOptions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiTokenConfigOptions.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiTypeLookup());
    if (+id > 0) {
      dispatch(getSpsApiTokenConfigOptionsById(+id));
    }
    return () => {
      dispatch(clearSpsApiTokenConfigOptionsGetById());
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
        {spsApiTokenConfigOptions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiTokenConfigOptions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiTokenConfigOptions"
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
                loading={spsApiTokenConfigOptions.save.loading || commonLookups.save.loading}
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
export default AddSpsApiTokenConfigOptionsModal;
