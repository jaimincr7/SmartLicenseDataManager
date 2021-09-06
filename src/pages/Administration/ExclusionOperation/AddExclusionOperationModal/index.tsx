import { Button, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigExclusionOperation } from '../../../../services/master/exclusionOperation/exclusionOperation.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigExclusionOperationById,
  saveConfigExclusionOperation,
} from '../../../../store/master/exclusionOperation/exclusionOperation.action';
import {
  clearConfigExclusionOperationGetById,
  clearConfigExclusionOperationMessages,
  configExclusionOperationSelector,
} from '../../../../store/master/exclusionOperation/exclusionOperation.reducer';
import { IAddConfigExclusionOperationProps } from './addExclusionOperation.model';

const AddConfigExclusionOperationModal: React.FC<IAddConfigExclusionOperationProps> = (props) => {
  const configExclusionOperation = useAppSelector(configExclusionOperationSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigExclusionOperation} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigExclusionOperation = {
    name: '',
    is_enabled: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigExclusionOperation = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigExclusionOperation(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigExclusionOperation) => {
    if (data) {
      initialValues = {
        name: data.name,
        logical_operation: data.logical_operation,
        sql_operation: data.sql_operation,
        is_enabled: data.is_enabled,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configExclusionOperation.save.messages.length > 0) {
      if (configExclusionOperation.save.hasErrors) {
        toast.error(configExclusionOperation.save.messages.join(' '));
      } else {
        toast.success(configExclusionOperation.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigExclusionOperationMessages());
    }
  }, [configExclusionOperation.save.messages]);

  useEffect(() => {
    if (+id > 0 && configExclusionOperation.getById.data) {
      const data = configExclusionOperation.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configExclusionOperation.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigExclusionOperationById(+id));
    }
    return () => {
      dispatch(clearConfigExclusionOperationGetById());
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
        {configExclusionOperation.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configExclusionOperation.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configExclusionOperation"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Name</label>
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ required: true, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Logical Operation</label>
                  <Form.Item name="logical_operation" label="Logical Operation" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SQL Operation</label>
                  <Form.Item name="sql_operation" label="SQL Operation" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Enabled</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configExclusionOperation.save.loading}
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
export default AddConfigExclusionOperationModal;
