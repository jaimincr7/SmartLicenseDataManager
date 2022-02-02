import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { IAzureRateCard } from '../../../../services/azure/azureRateCard/azureRateCard.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAzureRateCardById,
  saveAzureRateCard,
} from '../../../../store/azure/azureRateCard/azureRateCard.action';
import {
  clearAzureRateCardGetById,
  clearAzureRateCardMessages,
  azureRateCardSelector,
} from '../../../../store/azure/azureRateCard/azureRateCard.reducer';
import { IAddAzureRateCardProps } from './addAzureRateCard.model';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';

const AddAzureRateCardModal: React.FC<IAddAzureRateCardProps> = (props) => {
  const azureRateCard = useAppSelector(azureRateCardSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.AzureRateCard} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAzureRateCard = {
    effective_date: null,
    included_quantity: null,
    meter_category: '',
    meter_id: '',
    meter_name: '',
    meter_rates: '',
    meter_region: '',
    meter_status: '',
    meter_sub_category: '',
    meter_tags: '',
    unit: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: IAzureRateCard) => {
    const inputValues: IAzureRateCard = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.effective_date = passDateToApi(inputValues.effective_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveAzureRateCard(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        azureRateCard.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IAzureRateCard) => {
    if (data) {
      initialValues = {
        meter_id: data.meter_id,
        meter_category: data.meter_category,
        meter_sub_category: data.meter_sub_category,
        meter_region: data.meter_region,
        meter_name: data.meter_name,
        effective_date: _.isNull(data.effective_date) ? null : forEditModal(data.effective_date),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        included_quantity: data.included_quantity,
        meter_rates: data.meter_rates,
        meter_status: data.meter_status,
        meter_tags: data.meter_tags,
        unit: data.unit,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (azureRateCard.save.messages.length > 0) {
      if (azureRateCard.save.hasErrors) {
        toast.error(azureRateCard.save.messages.join(' '));
      } else {
        toast.success(azureRateCard.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAzureRateCardMessages());
    }
  }, [azureRateCard.save.messages]);

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
    if (+id > 0 && azureRateCard.getById.data) {
      const data = azureRateCard.getById.data;
      fillValuesOnEdit(data);
    }
  }, [azureRateCard.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getAzureRateCardById(+id));
    }
    return () => {
      dispatch(clearAzureRateCardGetById());
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
        {azureRateCard.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={azureRateCard.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAzureRateCard"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_id']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Id'
                  )}
                  <Form.Item
                    name="meter_id"
                    label="Meter Id"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_name']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Name'
                  )}
                  <Form.Item
                    name="meter_name"
                    label="Meter Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_category']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Category'
                  )}
                  <Form.Item
                    name="meter_category"
                    label="Meter Category"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'meter_sub_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Meter Sub-Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Sub-Category'
                  )}
                  <Form.Item
                    name="meter_sub_category"
                    label="Meter Sub-Category"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_region']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Region</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Region'
                  )}
                  <Form.Item
                    name="meter_region"
                    label="Meter Region"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_rates']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Rates</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Rates'
                  )}
                  <Form.Item
                    name="meter_rates"
                    label="Meter Rates"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_status']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Status'
                  )}
                  <Form.Item
                    name="meter_status"
                    label="Meter Status"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'meter_tags']} valuePropName="checked" noStyle>
                      <Checkbox>Meter Tags</Checkbox>
                    </Form.Item>
                  ) : (
                    'Meter Tags'
                  )}
                  <Form.Item
                    name="meter_tags"
                    label="Meter Tags"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'unit']} valuePropName="checked" noStyle>
                      <Checkbox>Unit</Checkbox>
                    </Form.Item>
                  ) : (
                    'Unit'
                  )}
                  <Form.Item name="unit" label="Unit" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'included_quantity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Included quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Included quantity'
                  )}
                  <Form.Item
                    name="included_quantity"
                    label="Included quantity"
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
                    <Form.Item name={['checked', 'date_added']} valuePropName="checked" noStyle>
                      <Checkbox>Date Added</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Added'
                  )}
                  <Form.Item name="date_added" label="Date Added" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'effective_date']} valuePropName="checked" noStyle>
                      <Checkbox>Effective date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Effective date'
                  )}
                  <Form.Item name="effective_date" label="Effective date" className="m-0">
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
                loading={azureRateCard.save.loading || common.save.loading}
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
export default AddAzureRateCardModal;
