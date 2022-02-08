import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
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
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { updateMultiple } from '../../../../store/common/common.action';

const AddCmsVendorModal: React.FC<IAddCmsVendorProps> = (props) => {
  const cmsVendor = useAppSelector(cmsVendorSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    if (!isMultiple) {
      dispatch(saveCmsVendor(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsVendor.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmsVendor) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        vendor: _.isNull(data.vendor) ? null : data.vendor,
        publisher: _.isNull(data.publisher) ? null : data.publisher,
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
                    <Form.Item name={['checked', 'description']} valuePropName="checked" noStyle>
                      <Checkbox>Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Description'
                  )}
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
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'publisher']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="vendor" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vendor']} valuePropName="checked" noStyle>
                      <Checkbox>Vendor</Checkbox>
                    </Form.Item>
                  ) : (
                    'Vendor'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsVendor.save.loading || common.save.loading}
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
