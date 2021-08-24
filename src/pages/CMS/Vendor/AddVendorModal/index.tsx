import { Button, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmsVendor } from '../../../../services/cms/vendor/vendor.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmsVendorById, saveCmsVendor } from '../../../../store/cms/vendor/vendor.action';
import {
  clearCmsVendorGetById,
  clearCmsVendorMessages,
  cmsVendorSelector,
} from '../../../../store/cms/vendor/vendor.reducer';
import { IAddCmsVendorProps } from './addVendor.model';

const AddCmsVendorModal: React.FC<IAddCmsVendorProps> = (props) => {
  const cmsVendor = useAppSelector(cmsVendorSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsVendor} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsVendor = {
    name: '',
    description: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsVendor = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmsVendor(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsVendor) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        vendor: _.isNull(data.vendor) ? null : data.vendor,
        publisher: _.isNull(data.publisher) ? null : data.publisher,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsVendor.save.messages.length > 0) {
      if (cmsVendor.save.hasErrors) {
        toast.error(cmsVendor.save.messages.join(' '));
      } else {
        toast.success(cmsVendor.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsVendorMessages());
    }
  }, [cmsVendor.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmsVendor.getById.data) {
      const data = cmsVendor.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsVendor.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getCmsVendorById(+id));
    }
    return () => {
      dispatch(clearCmsVendorGetById());
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
        {cmsVendor.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsVendor.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsVendor"
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
                  <label className="label">Description</label>
                  <Form.Item
                    name="description"
                    label="Description"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="publisher" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Publisher</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="vendor" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Vendor</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsVendor.save.loading}
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
export default AddCmsVendorModal;
