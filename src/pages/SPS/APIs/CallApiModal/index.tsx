import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { validateMessages } from '../../../../common/constants/common';
import { useAppSelector } from '../../../../store/app.hooks';
import { spsApiSelector } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { ICallApiModalProps } from './callApiModal.model';

const CallApiModal: React.FC<ICallApiModalProps> = (props) => {
  const { showModal, handleModalClose, params, onCallApi } = props;
  const spsApis = useAppSelector(spsApiSelector);

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
                  {['@STARTTIME', '@ENDTIME'].includes(queryParams[key]) ? (
                    <DatePicker className="form-control w-100"></DatePicker>
                  ) : (
                    <Input className="form-control" disabled={!isEditable} />
                  )}
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
    onCallApi(values);
    // const callApiObj: ICallAPI = {
    //   id: id,
    //   company_id: globalLookups.search.company_id,
    //   bu_id: globalLookups.search.bu_id,
    //   tenant_id: globalLookups.search.tenant_id,
    //   spsApiQueryParam: values,
    // };
    // dispatch(callApi(callApiObj));
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
