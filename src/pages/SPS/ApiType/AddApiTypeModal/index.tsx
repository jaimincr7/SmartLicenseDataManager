import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiType } from '../../../../services/sps/apiType/apiType.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getSpsApiTypeById, saveSpsApiType } from '../../../../store/sps/apiType/apiType.action';
import {
  clearSpsApiTypeGetById,
  clearSpsApiTypeMessages,
  spsApiTypeSelector,
} from '../../../../store/sps/apiType/apiType.reducer';
import { IAddSpsApiTypeProps } from './addApiType.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiGroupLookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiTypeModal: React.FC<IAddSpsApiTypeProps> = (props) => {
  const spsApiType = useAppSelector(spsApiTypeSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SpsApiType} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiType = {
    name: '',
    route: '',
    url: '',
    api_group_id: null,
    base_urls: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiType = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiType(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiType.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiType) => {
    if (data) {
      initialValues = {
        name: data.name,
        route: data.route,
        url: data.url,
        api_group_id: _.isNull(data.api_group_id) ? null : data.api_group_id,
        base_urls: data.base_urls,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiType.save.messages.length > 0) {
      if (spsApiType.save.hasErrors) {
        toast.error(spsApiType.save.messages.join(' '));
      } else {
        toast.success(spsApiType.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiTypeMessages());
    }
  }, [spsApiType.save.messages]);

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
    if (+id > 0 && spsApiType.getById.data) {
      const data = spsApiType.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiType.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiGroupLookup());
    if (+id > 0) {
      dispatch(getSpsApiTypeById(+id));
    }
    return () => {
      dispatch(clearSpsApiTypeGetById());
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
        {spsApiType.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiType.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiType"
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
                    <Form.Item name={['checked', 'route']} valuePropName="checked" noStyle>
                      <Checkbox>Route</Checkbox>
                    </Form.Item>
                  ) : (
                    'Route'
                  )}
                  <Form.Item
                    name="route"
                    label="Route"
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
                    <Form.Item name={['checked', 'url']} valuePropName="checked" noStyle>
                      <Checkbox>URL</Checkbox>
                    </Form.Item>
                  ) : (
                    'URL'
                  )}
                  <Form.Item name="url" label="URL" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'base_urls']} valuePropName="checked" noStyle>
                      <Checkbox>Base Urls</Checkbox>
                    </Form.Item>
                  ) : (
                    'Base Urls'
                  )}
                  <Form.Item
                    name="base_urls"
                    label="Base Urls"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col> */}
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
                      allowClear
                      loading={commonLookups.spsApiGroups.loading}
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiType.save.loading || commonLookups.save.loading}
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
export default AddSpsApiTypeModal;
