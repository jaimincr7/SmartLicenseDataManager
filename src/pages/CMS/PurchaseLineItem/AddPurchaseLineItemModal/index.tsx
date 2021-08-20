import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmsCategoryExtendedLookup,
  getCmsCategoryLookup,
  getCmsPurchaseLookup,
  getCurrencyLookup,
} from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { IAddCmsPurchaseLineItemProps } from './addPurchaseLineItem.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearCmsPurchaseLineItemGetById,
  clearCmsPurchaseLineItemMessages,
  cmsPurchaseLineItemSelector,
} from '../../../../store/cms/purchaseLineItem/purchaseLineItem.reducer';
import { ICmsPurchaseLineItem } from '../../../../services/cms/purchaseLineItem/purchaseLineItem.model';
import {
  getCmsPurchaseLineItemById,
  saveCmsPurchaseLineItem,
} from '../../../../store/cms/purchaseLineItem/purchaseLineItem.action';

const { Option } = Select;

const AddCmsPurchaseLineItemModal: React.FC<IAddCmsPurchaseLineItemProps> = (props) => {
  const cmsPurchaseLineItem = useAppSelector(cmsPurchaseLineItemSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsPurchaseLineItem} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsPurchaseLineItem = {
    purchase_id: null,
    part_number: '',
    product_name: '',
    quantity: null,
    unit_price: null,
    extended_price: null,
    currency_id: null,
    category_id: null,
    category_extended_id: null,
    start_date: null,
    end_date: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsPurchaseLineItem = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmsPurchaseLineItem(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsPurchaseLineItem) => {
    if (data) {
      initialValues = {
        purchase_id:  _.isNull(data.purchase_id) ? null :data.purchase_id,
        part_number: data.part_number,
        product_name: data.product_name,
        quantity: data.quantity,
        unit_price: data.unit_price,
        extended_price: data.extended_price,
        currency_id: _.isNull(data.currency_id) ? null :data.currency_id,
        category_id: _.isNull(data.category_id) ? null :data.category_id,
        category_extended_id: _.isNull(data.category_extended_id) ? null :data.category_extended_id,
        start_date: _.isNull(data.start_date) ? null : moment(data.start_date),
        end_date: _.isNull(data.end_date) ? null : moment(data.end_date),
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsPurchaseLineItem.save.messages.length > 0) {
      if (cmsPurchaseLineItem.save.hasErrors) {
        toast.error(cmsPurchaseLineItem.save.messages.join(' '));
      } else {
        toast.success(cmsPurchaseLineItem.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsPurchaseLineItemMessages());
    }
  }, [cmsPurchaseLineItem.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmsPurchaseLineItem.getById.data) {
      const data = cmsPurchaseLineItem.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsPurchaseLineItem.getById.data]);

  useEffect(() => {
    dispatch(getCurrencyLookup());
    dispatch(getCmsPurchaseLookup());
    dispatch(getCmsCategoryLookup());
    dispatch(getCmsCategoryExtendedLookup());
    if (+id > 0) {
      dispatch(getCmsPurchaseLineItemById(+id));
    }
    return () => {
      dispatch(clearCmsPurchaseLineItemGetById());
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getCmsPurchaseLineItemById(+id));
    }
    return () => {
      dispatch(clearCmsPurchaseLineItemGetById());
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
        {cmsPurchaseLineItem.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsPurchaseLineItem.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsPurchaseLineItem"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Purchase</label>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="purchase_id"
                    className="m-0"
                    label="Purchase"
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsPurchaseLookup.loading}
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
                      {commonLookups.cmsPurchaseLookup.data.map((option: ILookup) => (
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
                  <label className="label">Category</label>
                  <Form.Item
                    name="category_id"
                    className="m-0"
                    label="Category"
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsCategoryLookup.loading}
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
                      {commonLookups.cmsCategoryLookup.data.map((option: ILookup) => (
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
                  <label className="label">Category Extended</label>
                  <Form.Item
                    name="category_extended_id"
                    className="m-0"
                    label="Category Extended"
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsCategoryExtendedLookup.loading}
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
                      {commonLookups.cmsCategoryExtendedLookup.data.map((option: ILookup) => (
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
                  <label className="label">Currency</label>
                  <Form.Item
                    name="currency_id"
                    className="m-0"
                    label="Currency"
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.currencyLookup.loading}
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
                      {commonLookups.currencyLookup.data.map((option: ILookup) => (
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
                  <label className="label">Part Number</label>
                  <Form.Item
                    name="part_number"
                    label="Part Number"
                    className="m-0"
                    rules={[{ max: 100, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Name</label>
                  <Form.Item
                    name="product_name"
                    label="Product Name"
                    className="m-0"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Quantity</label>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Unit Price</label>
                  <Form.Item
                    name="unit_price"
                    label="Unit Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Extended Price</label>
                  <Form.Item
                    name="extended_price"
                    label="Extended Price"
                    className="m-0"
                    rules={[{ required: true,type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Start Date</label>
                  <Form.Item
                    name="start_date"
                    label="Start DATE"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">End DATE</label>
                  <Form.Item
                    name="end_date"
                    label="End DATE"
                    className="m-0"
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsPurchaseLineItem.save.loading}
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
export default AddCmsPurchaseLineItemModal;
