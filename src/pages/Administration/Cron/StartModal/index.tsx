import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { IStartApi } from '../../../../services/master/cron/cron.model';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getCronFormula } from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { startApi } from '../../../../store/master/cron/cron.action';
import { clearCronMessages, cronSelector } from '../../../../store/master/cron/cron.reducer';
import { IStartApiModalProps } from './startApiModal.model';

const { Option } = Select;

const StartApiModal: React.FC<IStartApiModalProps> = (props) => {
  const { id, startTime, setShowApi, refreshDataTable, queryParams, frequency, showModal } = props;
  const cron = useAppSelector(cronSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getCronFormula());
    const inputValues = {
      cron_job_frequency_id: frequency,
    };
    form.setFieldsValue(inputValues);
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

  const onFinish = (values: any) => {
    const startApiData: IStartApi = {
      id: id,
      cron_job_frequency_id: values.cron_job_frequency_id,
      sps_api_query_param: !startTime
        ? [
            {
              startTime: values.startTime,
              endTime: values.endTime,
            },
          ]
        : [],
    };
    dispatch(startApi(startApiData));
  };

  useEffect(() => {
    if (cron.startApi.messages.length > 0) {
      if (cron.startApi.hasErrors) {
        toast.error(cron.startApi.messages.join(' '));
      } else {
        toast.success(cron.startApi.messages.join(' '));
        setShowApi(false);
        refreshDataTable();
      }
      dispatch(clearCronMessages());
    }
  }, [cron.startApi.messages]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={'Schedule API'}
        centered
        visible={showModal}
        footer={false}
        onCancel={() => {
          setShowApi(false);
        }}
      >
        <Form
          form={form}
          name="addSqlServerEntitlements"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Frequency</label>
                <Form.Item name="cron_job_frequency_id" className="m-0" label="Frequency">
                  <Select
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
                    loading={commonLookups.cronFormula.loading}
                  >
                    {commonLookups.cronFormula.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            {!startTime && renderHTml()}
            {/* <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Start Time</label>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  className="m-0"
                  rules={[{ required: !startTime }]}
                >
                  <Input className="form-control" disabled={startTime} />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">End Time</label>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  className="m-0"
                  rules={[{ required: !startTime }]}
                >
                  <Input className="form-control" disabled={startTime} />
                </Form.Item>
              </div>
            </Col> */}
          </Row>
          <div className="btns-block modal-footer">
            <Button key="submit" type="primary" htmlType="submit" loading={cron.startApi.loading}>
              Set
            </Button>
            <Button key="back" onClick={() => setShowApi(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default StartApiModal;
