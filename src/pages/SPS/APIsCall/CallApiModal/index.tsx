import { Button, Col, DatePicker, Form, Modal, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { validateMessages } from '../../../../common/constants/common';
import { ICallAPI } from '../../../../services/sps/spsApiCall/spsApiCall.model';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { callApi } from '../../../../store/sps/spsAPICall/spsApiCall.action';
import { spsApiCallSelector } from '../../../../store/sps/spsAPICall/spsApiCall.reducer';
import { ICallApiModalProps } from './callApiModal.model';

const CallApiModal: React.FC<ICallApiModalProps> = (props) => {
  const { showModal, handleModalClose, params, id, company_id, tenant_id, bu_id } = props;
  const spsApis = useAppSelector(spsApiCallSelector);
  const dispatch = useAppDispatch();

  const [queryParams, setQueryParams] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (params) {
      setQueryParams(params);
    }
  }, []);

  const renderHTml = () => {
    return (
      <>
        {Object.keys(queryParams)?.map((key, index) => {
          const isEditable = queryParams[key].charAt(0) === '@';
          if (!isEditable) {
            form.setFieldsValue({ [key]: queryParams[key] });
          }

          return (
            <Col xs={24} sm={12} md={8} key={key + index}>
              <div className="form-group m-0">
                <label className="label">{key}</label>
                <Form.Item
                  name={key}
                  label={key}
                  className="m-0"
                  rules={[{ required: isEditable }]}
                >
                  <DatePicker className="form-control w-100"></DatePicker>
                </Form.Item>
              </div>
            </Col>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    if (spsApis.callApi.messages.length > 0) {
      handleModalClose();
    }
  }, [spsApis.callApi.messages]);

  useEffect(() => {
    if (spsApis.callAllApi.messages.length > 0) {
      handleModalClose();
    }
  }, [spsApis.callAllApi.messages]);

  const onFinish = (values: any) => {
    const dummyValue = {
      startTime: moment(values.startTime).format('YYYY-MM-DD'),
      endTime: moment(values.endTime).format('YYYY-MM-DD'),
    };
    const callApiObj: ICallAPI = {
      id: id,
      company_id: company_id,
      bu_id: bu_id,
      tenant_id: tenant_id,
      sps_api_query_param: dummyValue,
    };
    dispatch(callApi(callApiObj));
  };

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={'Add Query Params'}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="addSqlServerEntitlements"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            {queryParams && renderHTml()}
          </Row>
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={spsApis.callApi.loading || spsApis.callAllApi.loading}
            >
              Apply
            </Button>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CallApiModal;
