import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigOnlineProducts } from '../../../../services/master/onlineProducts/onlineProducts.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigOnlineProductsById,
  saveConfigOnlineProducts,
} from '../../../../store/master/onlineProducts/onlineProducts.action';
import {
  clearConfigOnlineProductsGetById,
  clearConfigOnlineProductsMessages,
  configOnlineProductsSelector,
} from '../../../../store/master/onlineProducts/onlineProducts.reducer';
import { IAddConfigOnlineProductsProps } from './addOnlineProducts.model';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddConfigOnlineProductsModal: React.FC<IAddConfigOnlineProductsProps> = (props) => {
  const configOnlineProducts = useAppSelector(configOnlineProductsSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigOnlineProducts} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigOnlineProducts = {
    name: '',
    string_id: '',
    guid: '',
    price: null,
    units: '',
    enterprise_product: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigOnlineProducts = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigOnlineProducts(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configOnlineProducts.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigOnlineProducts) => {
    if (data) {
      initialValues = {
        name: data.name,
        string_id: data.string_id,
        guid: data.guid,
        price: data.price,
        units: data.units,
        enterprise_product: data.enterprise_product,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configOnlineProducts.save.messages.length > 0) {
      if (configOnlineProducts.save.hasErrors) {
        toast.error(configOnlineProducts.save.messages.join(' '));
      } else {
        toast.success(configOnlineProducts.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigOnlineProductsMessages());
    }
  }, [configOnlineProducts.save.messages]);

  useEffect(() => {
    if (common.save.messages.length > 0) {
      if (common.save.hasErrors) {
        toast.error(common.save.messages.join(' '));
      } else {
        toast.warn(common.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [common.save.messages]);

  useEffect(() => {
    if (+id > 0 && configOnlineProducts.getById.data) {
      const data = configOnlineProducts.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configOnlineProducts.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigOnlineProductsById(+id));
    }
    return () => {
      dispatch(clearConfigOnlineProductsGetById());
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
        {configOnlineProducts.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configOnlineProducts.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configOnlineProducts"
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
                    <Form.Item name={['checked', 'string_id']} valuePropName="checked" noStyle>
                      <Checkbox>String ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'String ID'
                  )}
                  <Form.Item
                    name="string_id"
                    label="String ID"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'guid']} valuePropName="checked" noStyle>
                      <Checkbox>GUID</Checkbox>
                    </Form.Item>
                  ) : (
                    'GUID'
                  )}
                  <Form.Item name="guid" label="GUID" className="m-0" rules={[{ max: 36 }]}>
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
                  <Form.Item name="enterprise_product" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configOnlineProducts.save.loading || common.save.loading}
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
export default AddConfigOnlineProductsModal;
