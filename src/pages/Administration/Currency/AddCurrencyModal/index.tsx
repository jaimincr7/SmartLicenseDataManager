import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { ICurrency } from '../../../../services/master/currency/currency.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getCurrencyById, saveCurrency } from '../../../../store/master/currency/currency.action';
import {
  clearCurrencyGetById,
  clearCurrencyMessages,
  currencySelector,
} from '../../../../store/master/currency/currency.reducer';
import { IAddCurrencyProps } from './addCurrency.model';

const AddCurrencyModal: React.FC<IAddCurrencyProps> = (props) => {
  const currency = useAppSelector(currencySelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Currency} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICurrency = {
    currency: '',
    exchange_rate: null,
    symbol: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICurrency = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCurrency(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        currency.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICurrency) => {
    if (data) {
      initialValues = {
        currency: data.currency,
        exchange_rate: data.exchange_rate,
        symbol: data.symbol,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (currency.save.messages.length > 0) {
      if (currency.save.hasErrors) {
        toast.error(currency.save.messages.join(' '));
      } else {
        toast.success(currency.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCurrencyMessages());
    }
  }, [currency.save.messages]);

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
    if (+id > 0 && currency.getById.data) {
      const data = currency.getById.data;
      fillValuesOnEdit(data);
    }
  }, [currency.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getCurrencyById(+id));
    }
    return () => {
      dispatch(clearCurrencyGetById());
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
        {currency.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={currency.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addCurrency"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'currency']} valuePropName="checked" noStyle>
                      <Checkbox>Currency Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Currency Name'
                  )}
                  <Form.Item
                    name="currency"
                    label="Currency Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'exchange_rate']} valuePropName="checked" noStyle>
                      <Checkbox>Exchange Rate</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exchange Rate'
                  )}
                  <Form.Item
                    name="exchange_rate"
                    label="Exchange Rate"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'symbol']} valuePropName="checked" noStyle>
                      <Checkbox>Symbol</Checkbox>
                    </Form.Item>
                  ) : (
                    'Symbol'
                  )}
                  <Form.Item name="symbol" label="Symbol" className="m-0" rules={[{ max: 10 }]}>
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
                loading={currency.save.loading || common.save.loading}
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
export default AddCurrencyModal;
