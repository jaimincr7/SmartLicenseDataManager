import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getSpsApiInjectionParamV2 } from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.action';
import {
  clearSpsApiInjectionParamV2,
  spsApiInjectionParamV2Selector,
} from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.reducer';
import { saveSpsApiInjectionValueParamV2 } from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.action';
import {
  clearSpsApiInjectionValueParamV2Messages,
  spsApiInjectionValueParamV2Selector,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.reducer';
import { IApiInjectionParamV2Props } from './apiInjectionParamV2.model';

const ApiInjectionParamV2: React.FC<IApiInjectionParamV2Props> = (props) => {
  const { handleModalClose, showModal, id, oauth_id } = props;

  const spsApiInjectionParamV2 = useAppSelector(spsApiInjectionParamV2Selector);
  const spsApiInjectionValueV2 = useAppSelector(spsApiInjectionValueParamV2Selector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);

  const onFinish = (values: any) => {
    const arr = [];
    values.inj.map((options, index) => {
      const obj = {
        injection_param_id: options.inj,
        value: values.value[index].value,
      };
      arr.push(obj);
    });
    const finalObj = {
      oauth_id: oauth_id,
      injection_values: arr,
    };
    dispatch(saveSpsApiInjectionValueParamV2(finalObj));
  };

  useEffect(() => {
    if (spsApiInjectionValueV2.save.messages.length > 0) {
      if (spsApiInjectionValueV2.save.hasErrors) {
        toast.error(spsApiInjectionValueV2.save.messages.join(' '));
      } else {
        toast.success(spsApiInjectionValueV2.save.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSpsApiInjectionValueParamV2Messages());
    }
  }, [spsApiInjectionValueV2.save.messages]);

  useEffect(() => {
    if (spsApiInjectionParamV2.getInjectionParam.data?.length > 0)
      setRecords(spsApiInjectionParamV2.getInjectionParam?.data);
  }, [spsApiInjectionParamV2.getInjectionParam?.data]);

  useEffect(() => {
    dispatch(getSpsApiInjectionParamV2(id));
    return () => {
      dispatch(clearSpsApiInjectionParamV2());
    };
  }, []);

  const removeRecord = (value) => {
    const dummyR = records.filter((data) => data.id !== value);
    setRecords(dummyR);
  };

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={'Injection Value'}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form form={form} name="spsApiOauthV2" onFinish={onFinish}>
          {records?.length > 0 &&
            (records || []).map((option, index) => (
              <>
                <Row gutter={[30, 15]} className="form-label-hide" key={index}>
                  <Col xs={24} sm={12} md={6}>
                    <label className="label w-100">Injection Param</label>
                    <Form.Item
                      name={['inj', index, 'inj']}
                      initialValue={option.id}
                      label="Injection Param"
                      className="m-0"
                    >
                      {option.name}
                      <Input className="form-control" value={option.id} hidden={true} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <label className="label w-100">Value</label>
                    <Form.Item
                      name={['value', index, 'value']}
                      label="Value"
                      className="m-0"
                      rules={[{ required: true }]}
                    >
                      <Input className="form-control" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <label className="label w-100"></label>
                    <Button onClick={() => removeRecord(option.id)}>Remove</Button>
                  </Col>
                </Row>
                <hr />
              </>
            ))}
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={spsApiInjectionValueV2.save.loading}
            >
              Save
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
export default ApiInjectionParamV2;
