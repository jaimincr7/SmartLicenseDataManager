import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigO365Products } from '../../../../services/master/configO365Products/configO365Products.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigO365ProductsById,
  saveConfigO365Products,
} from '../../../../store/master/configO365Products/configO365Products.action';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearConfigO365ProductsGetById,
  clearConfigO365ProductsMessages,
  configO365ProductsSelector,
} from '../../../../store/master/configO365Products/configO365Products.reducer';
import { IAddConfigO365ProductsProps } from './addConfigO365Products.model';
import React from 'react';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddConfigO365ProductsModal: React.FC<IAddConfigO365ProductsProps> = (props) => {
  const configO365Products = useAppSelector(configO365ProductsSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigO365Products} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigO365Products = {
    product: '',
    price: null,
    units: '',
    enterprise_product: false,
    component_only: false,
    hide: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigO365Products = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigO365Products(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configO365Products.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigO365Products) => {
    if (data) {
      initialValues = {
        product: data.product,
        price: _.isNull(data.price) ? null : data.price,
        units: data.units,
        enterprise_product: data.enterprise_product,
        component_only: data.component_only,
        hide: data.hide,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configO365Products.save.messages.length > 0) {
      if (configO365Products.save.hasErrors) {
        toast.error(configO365Products.save.messages.join(' '));
      } else {
        toast.success(configO365Products.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigO365ProductsMessages());
    }
  }, [configO365Products.save.messages]);

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
    if (+id > 0 && configO365Products.getById.data) {
      const data = configO365Products.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configO365Products.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigO365ProductsById(+id));
    }
    return () => {
      dispatch(clearConfigO365ProductsGetById());
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
        {configO365Products.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configO365Products.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addConfigO365Products"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product']} valuePropName="checked" noStyle>
                      <Checkbox>Products</Checkbox>
                    </Form.Item>
                  ) : (
                    'Products'
                  )}
                  <Form.Item name="product" label="Products" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'price']} valuePropName="checked" noStyle>
                      <Checkbox>Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Price'
                  )}
                  <Form.Item
                    name="price"
                    label="Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'units']} valuePropName="checked" noStyle>
                      <Checkbox>Units</Checkbox>
                    </Form.Item>
                  ) : (
                    'Units'
                  )}
                  <Form.Item name="units" label="Units" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enterprise_product" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'enterprise_product']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Enterprise Product</Checkbox>
                    </Form.Item>
                  ) : (
                    'Enterprise Product'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="component_only" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'component_only']} valuePropName="checked" noStyle>
                      <Checkbox>Component Only</Checkbox>
                    </Form.Item>
                  ) : (
                    'Component Only'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="hide" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'hide']} valuePropName="checked" noStyle>
                      <Checkbox>Hide</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hide'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configO365Products.save.loading || commonLookups.save.loading}
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
export default AddConfigO365ProductsModal;
