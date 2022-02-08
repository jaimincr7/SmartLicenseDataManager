import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
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
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmsContactProps } from './addContact.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddCmsContactModal: React.FC<IAddCmsContactProps> = (props) => {
  const cmsContact = useAppSelector(cmsContactSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    if (!isMultiple) {
      dispatch(saveCmsContact(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsContact.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmsContact) => {
    if (data) {
      initialValues = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'email']} valuePropName="checked" noStyle>
                      <Checkbox>Email</Checkbox>
                    </Form.Item>
                  ) : (
                    'Email'
                  )}
                  <Form.Item
                    name="email"
                    label="Email"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'email', max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'phone_number']} valuePropName="checked" noStyle>
                      <Checkbox>Phone Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Phone Number'
                  )}
                  <Form.Item
                    name="phone_number"
                    label="Phone Number"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 100 }]}
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
                loading={cmsContact.save.loading || common.save.loading}
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
