import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiGroups,
  getSpsApiTypes,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  clearSpsApiGroupsLookup,
  clearSpsApiTypesLookup,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddApiModalProps } from './addApiModal.model';
import {
  clearCallApiMessages,
  clearSpsApiGetById,
  spsApiSelector,
} from './../../../../store/sps/spsAPI/spsApi.reducer';
import { ISpsApi } from '../../../../services/sps/spsApi/sps.model';
import { getSpsApiById, saveSpsApi } from './../../../../store/sps/spsAPI/spsApi.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { TextArea } = Input;
const { Option } = Select;

const AddApiModal: React.FC<IAddApiModalProps> = (props) => {
  const spsApiState = useAppSelector(spsApiSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SPSApi} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApi = {
    name: '',
    url: '',
    group_id: null,
    api_type_id: null,
    sps_input_type_id: null,
    stored_procedure: '',
    enabled: false,
    is_system_defined: true,
    api_data_format: 'Json',
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApi = {
      ...values,
      enabled: values.enabled,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApi(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiState.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data) => {
    if (data) {
      initialValues = {
        name: data.name,
        url: data.url,
        group_id: _.isNull(data.group_id) ? null : data.group_id,
        api_type_id: _.isNull(data.api_type_id) ? null : data.api_type_id,
        sps_input_type_id: _.isNull(data.sps_input_type_id) ? null : data.sps_input_type_id,
        stored_procedure: data.stored_procedure,
        enabled: data.enabled,
        api_data_format: _.isNull(data.api_data_format) ? 'Json' : data.api_data_format,
        is_system_defined: data.is_system_defined,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiState.save.messages.length > 0) {
      if (spsApiState.save.hasErrors) {
        toast.error(spsApiState.save.messages.join(' '));
      } else {
        toast.success(spsApiState.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCallApiMessages());
    }
  }, [spsApiState.save.messages]);

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
    if (+id > 0 && spsApiState.getById.data) {
      const data = spsApiState.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiState.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiGroups());
    dispatch(getSpsApiTypes());
    if (+id > 0) {
      dispatch(getSpsApiById(+id));
    }
    return () => {
      dispatch(clearSpsApiGetById());
      dispatch(clearSpsApiGroupsLookup());
      dispatch(clearSpsApiTypesLookup());
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
        {spsApiState.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiState.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTabVCluster"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 30]} className="form-label-hide">
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
                    <Form.Item name={['checked', 'group_id']} valuePropName="checked" noStyle>
                      <Checkbox>Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Group'
                  )}
                  <Form.Item
                    name="group_id"
                    className="m-0"
                    label="Group"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      onChange={(val) => {
                        form.setFieldsValue({ group_id: val });
                      }}
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
                      loading={commonLookups.spsApiGroups.loading}
                    >
                      {commonLookups.spsApiGroups.data?.map((option: ILookup) => (
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
                      <Checkbox>Api Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Api Type'
                  )}
                  <Form.Item
                    name="api_type_id"
                    className="m-0"
                    label="Api Type"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      onChange={(val) => {
                        form.setFieldsValue({ api_type_id: val });
                      }}
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
                      loading={commonLookups.spsApiTypes.loading}
                    >
                      {commonLookups.spsApiTypes.data?.map((option: ILookup) => (
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
                      name={['checked', 'stored_procedure']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Stored Procedure</Checkbox>
                    </Form.Item>
                  ) : (
                    'Stored Procedure'
                  )}
                  <Form.Item
                    name="stored_procedure"
                    label="Stored Procedure"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_system_defined" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_system_defined']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is System Defined?</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is System Defined?'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'api_data_format']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>API Data Format</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Data Format'
                  )}
                  <Form.Item name="api_data_format" className="m-0" label="API Data Format">
                    <Select
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
                      loading={commonLookups.spsApiTypes.loading}
                    >
                      <Option value="Json">JSON</Option>
                      <Option value="File">FILE</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>

              <Col xs={24}>
                <div className="m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'url']} valuePropName="checked" noStyle>
                      <Checkbox>URL</Checkbox>
                    </Form.Item>
                  ) : (
                    'URL'
                  )}
                  <Form.Item name="url" label="URL" className="m-0">
                    <TextArea rows={4} style={{ minHeight: 100 }} />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiState.save.loading || commonLookups.save.loading}
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
export default AddApiModal;
