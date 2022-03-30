import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiTokenConfigOptionsV2 } from '../../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiTokenConfigOptionsV2ById,
  saveSpsApiTokenConfigOptionsV2,
} from '../../../../store/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.action';
import {
  clearSpsApiTokenConfigOptionsV2GetById,
  clearSpsApiTokenConfigOptionsV2Messages,
  spsApiTokenConfigOptionsV2Selector,
} from '../../../../store/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.reducer';
import { IAddSpsApiTokenConfigOptionsV2Props } from './addApiTokenConfigOptionsV2.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiTypeLookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiTokenConfigOptionsV2Modal: React.FC<IAddSpsApiTokenConfigOptionsV2Props> = (
  props
) => {
  const spsApiTokenConfigOptionsV2 = useAppSelector(spsApiTokenConfigOptionsV2Selector);
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
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiTokenConfigOptionsV2} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiTokenConfigOptionsV2 = {
    name: '',
    value: '',
    type: '',
    is_env_var: false,
    api_type_ids: typeId ? [+typeId] : undefined,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiTokenConfigOptionsV2 = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiTokenConfigOptionsV2(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiTokenConfigOptionsV2.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiTokenConfigOptionsV2) => {
    const typeIds = [];
    data.sps_api_token_config_options_v2_with_api_types.map((x) => {
      typeIds.push(x.api_type_id);
    });
    if (data) {
      initialValues = {
        name: data.name,
        value: data.value,
        type: data.type,
        api_type_ids: _.isNull(typeIds) ? null : typeIds,
        is_env_var: data.is_env_var,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiTokenConfigOptionsV2.save.messages.length > 0) {
      if (spsApiTokenConfigOptionsV2.save.hasErrors) {
        toast.error(spsApiTokenConfigOptionsV2.save.messages.join(' '));
      } else {
        toast.success(spsApiTokenConfigOptionsV2.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiTokenConfigOptionsV2Messages());
    }
  }, [spsApiTokenConfigOptionsV2.save.messages]);

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
    if (+id > 0 && spsApiTokenConfigOptionsV2.getById.data) {
      const data = spsApiTokenConfigOptionsV2.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiTokenConfigOptionsV2.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiTypeLookup());
    if (+id > 0) {
      dispatch(getSpsApiTokenConfigOptionsV2ById(+id));
    }
    return () => {
      dispatch(clearSpsApiTokenConfigOptionsV2GetById());
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
        {spsApiTokenConfigOptionsV2.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiTokenConfigOptionsV2.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiTokenConfigOptionsV2"
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
                loading={spsApiTokenConfigOptionsV2.save.loading || commonLookups.save.loading}
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
export default AddSpsApiTokenConfigOptionsV2Modal;
