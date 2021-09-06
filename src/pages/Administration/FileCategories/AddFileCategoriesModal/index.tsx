import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigFileCategories } from '../../../../services/master/fileCategories/fileCategories.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigFileCategoriesById,
  saveConfigFileCategories,
} from '../../../../store/master/fileCategories/fileCategories.action';
import {
  clearConfigFileCategoriesGetById,
  clearConfigFileCategoriesMessages,
  configFileCategoriesSelector,
} from '../../../../store/master/fileCategories/fileCategories.reducer';
import { IAddConfigFileCategoriesProps } from './addFileCategories.model';

const AddConfigFileCategoriesModal: React.FC<IAddConfigFileCategoriesProps> = (props) => {
  const configFileCategories = useAppSelector(configFileCategoriesSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigFileCategories} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigFileCategories = {
    name: '',
    description: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigFileCategories = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigFileCategories(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigFileCategories) => {
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
    if (configFileCategories.save.messages.length > 0) {
      if (configFileCategories.save.hasErrors) {
        toast.error(configFileCategories.save.messages.join(' '));
      } else {
        toast.success(configFileCategories.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigFileCategoriesMessages());
    }
  }, [configFileCategories.save.messages]);

  useEffect(() => {
    if (+id > 0 && configFileCategories.getById.data) {
      const data = configFileCategories.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configFileCategories.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigFileCategoriesById(+id));
    }
    return () => {
      dispatch(clearConfigFileCategoriesGetById());
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
        {configFileCategories.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configFileCategories.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configFileCategories"
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
                loading={configFileCategories.save.loading}
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
export default AddConfigFileCategoriesModal;
