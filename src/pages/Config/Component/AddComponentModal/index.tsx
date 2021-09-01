import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigComponent } from '../../../../services/config/component/component.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigComponentById,
  saveConfigComponent,
} from '../../../../store/config/component/component.action';
import {
  clearConfigComponentGetById,
  clearConfigComponentMessages,
  configComponentSelector,
} from '../../../../store/config/component/component.reducer';
import { IAddConfigComponentProps } from './addComponent.model';

const AddConfigComponentModal: React.FC<IAddConfigComponentProps> = (props) => {
  const configComponent = useAppSelector(configComponentSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigComponent} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigComponent = {
    name: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigComponent = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigComponent(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigComponent) => {
    if (data) {
      initialValues = {
        name: data.name,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configComponent.save.messages.length > 0) {
      if (configComponent.save.hasErrors) {
        toast.error(configComponent.save.messages.join(' '));
      } else {
        toast.success(configComponent.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigComponentMessages());
    }
  }, [configComponent.save.messages]);

  useEffect(() => {
    if (+id > 0 && configComponent.getById.data) {
      const data = configComponent.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configComponent.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigComponentById(+id));
    }
    return () => {
      dispatch(clearConfigComponentGetById());
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
        {configComponent.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configComponent.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configComponent"
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
                    rules={[{ required: true, max: 510 }]}
                  >
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
                loading={configComponent.save.loading}
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
export default AddConfigComponentModal;
