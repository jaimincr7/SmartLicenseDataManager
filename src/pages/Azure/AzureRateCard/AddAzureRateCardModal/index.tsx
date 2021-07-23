import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
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
import moment from 'moment';
import { validateMessages } from '../../../../common/constants/common';

const AddAzureRateCardModal: React.FC<IAddAzureRateCardProps> = (props) => {
  const azureRateCard = useAppSelector(azureRateCardSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Azure Rate Card' : 'Edit Azure Rate Card';
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
  };

  const onFinish = (values: IAzureRateCard) => {
    const inputValues: IAzureRateCard = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveAzureRateCard(inputValues));
  };

  const fillValuesOnEdit = async (data: IAzureRateCard) => {
    if (data) {
      initialValues = {
        meter_id: data.meter_id,
        meter_category: data.meter_category,
        meter_sub_category: data.meter_sub_category,
        meter_region: data.meter_region,
        meter_name: data.meter_name,
        effective_date: _.isNull(data.effective_date) ? null : moment(data.effective_date),
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
                  <label className="label">MeterId</label>
                  <Form.Item name="meter_id" label="MeterId" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Name</label>
                  <Form.Item
                    name="meter_name"
                    label="Meter name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Meter Category</label>
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
                  <label className="label">Meter Sub-Category</label>
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
                  <label className="label">Meter Region</label>
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
                  <label className="label">Meter Rates</label>
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
                  <label className="label">Meter Status</label>
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
                  <label className="label">Meter Tags</label>
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
                  <label className="label">Unit</label>
                  <Form.Item name="unit" label="Unit" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Included Quantity</label>
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
                  <label className="label">Effective Date</label>
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
                loading={azureRateCard.save.loading}
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
