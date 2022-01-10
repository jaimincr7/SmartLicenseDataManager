import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IConfigProcessors } from '../../../../services/master/processors/processors.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigProcessorsById,
  saveConfigProcessors,
} from '../../../../store/master/processors/processors.action';
import {
  clearConfigProcessorsGetById,
  clearConfigProcessorsMessages,
  configProcessorsSelector,
} from '../../../../store/master/processors/processors.reducer';
import { IAddConfigProcessorsProps } from './addProcessors.model';

const AddConfigProcessorsModal: React.FC<IAddConfigProcessorsProps> = (props) => {
  const configProcessors = useAppSelector(configProcessorsSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigProcessors} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigProcessors = {
    processor_desc: '',
    cores: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigProcessors = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigProcessors(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configProcessors.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigProcessors) => {
    if (data) {
      initialValues = {
        processor_desc: data.processor_desc,
        cores: data.cores,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configProcessors.save.messages.length > 0) {
      if (configProcessors.save.hasErrors) {
        toast.error(configProcessors.save.messages.join(' '));
      } else {
        toast.success(configProcessors.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigProcessorsMessages());
    }
  }, [configProcessors.save.messages]);

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
    if (+id > 0 && configProcessors.getById.data) {
      const data = configProcessors.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configProcessors.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigProcessorsById(+id));
    }
    return () => {
      dispatch(clearConfigProcessorsGetById());
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
        {configProcessors.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configProcessors.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configProcessors"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'processor_desc']} valuePropName="checked" noStyle>
                      <Checkbox>Processor Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Processor Description'
                  )}
                  <Form.Item
                    name="processor_desc"
                    label="Processor Description"
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
                    <Form.Item name={['checked', 'cores']} valuePropName="checked" noStyle>
                      <Checkbox>Cores</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cores'
                  )}
                  <Form.Item
                    name="cores"
                    label="Cores"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configProcessors.save.loading || common.save.loading}
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
export default AddConfigProcessorsModal;
