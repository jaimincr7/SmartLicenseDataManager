import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigFileType } from '../../../../services/master/fileTypes/fileTypes.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigFileTypeById,
  saveConfigFileType,
} from '../../../../store/master/fileTypes/fileTypes.action';
import {
  clearConfigFileTypeGetById,
  clearConfigFileTypeMessages,
  configFileTypeSelector,
} from '../../../../store/master/fileTypes/fileTypes.reducer';
import { IAddConfigFileTypeProps } from './addFileTypes.model';

const AddConfigFileTypeModal: React.FC<IAddConfigFileTypeProps> = (props) => {
  const configFileType = useAppSelector(configFileTypeSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigFileType} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigFileType = {
    name: '',
    description: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigFileType = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigFileType(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigFileType) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configFileType.save.messages.length > 0) {
      if (configFileType.save.hasErrors) {
        toast.error(configFileType.save.messages.join(' '));
      } else {
        toast.success(configFileType.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigFileTypeMessages());
    }
  }, [configFileType.save.messages]);

  useEffect(() => {
    if (+id > 0 && configFileType.getById.data) {
      const data = configFileType.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configFileType.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigFileTypeById(+id));
    }
    return () => {
      dispatch(clearConfigFileTypeGetById());
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
        {configFileType.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configFileType.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configFileType"
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
                  <label className="label">Description</label>
                  <Form.Item
                    name="description"
                    label="Description"
                    className="m-0"
                    rules={[{ required: true, max: 255 }]}
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
                loading={configFileType.save.loading}
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
export default AddConfigFileTypeModal;
