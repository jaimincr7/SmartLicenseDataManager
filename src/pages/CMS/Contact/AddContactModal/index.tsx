import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmsContact } from '../../../../services/cms/contact/contact.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmsContactById, saveCmsContact } from '../../../../store/cms/contact/contact.action';
import {
  clearCmsContactGetById,
  clearCmsContactMessages,
  cmsContactSelector,
} from '../../../../store/cms/contact/contact.reducer';
import { getTenantLookup } from '../../../../store/common/common.action';
import { clearBULookUp, clearCompanyLookUp } from '../../../../store/common/common.reducer';
import { IAddCmsContactProps } from './addContact.model';

const AddCmsContactModal: React.FC<IAddCmsContactProps> = (props) => {
  const cmsContact = useAppSelector(cmsContactSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsContact} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsContact = {
    name: '',
    email: '',
    phone_number: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsContact = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmsContact(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsContact) => {
    if (data) {
      initialValues = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsContact.save.messages.length > 0) {
      if (cmsContact.save.hasErrors) {
        toast.error(cmsContact.save.messages.join(' '));
      } else {
        toast.success(cmsContact.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsContactMessages());
    }
  }, [cmsContact.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmsContact.getById.data) {
      const data = cmsContact.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsContact.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmsContactById(+id));
    }
    return () => {
      dispatch(clearCmsContactGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
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
        {cmsContact.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsContact.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsContact"
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
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Email</label>
                  <Form.Item
                    name="email"
                    label="Email"
                    className="m-0"
                    rules={[{ required: true, type: 'email', max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Phone Number</label>
                  <Form.Item
                    name="phone_number"
                    label="Phone Number"
                    className="m-0"
                    rules={[{ required: true, max: 100 }]}
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
                loading={cmsContact.save.loading}
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
export default AddCmsContactModal;
