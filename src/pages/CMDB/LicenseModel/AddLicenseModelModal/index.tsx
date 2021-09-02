import { Button, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbLicenseModel } from '../../../../services/cmdb/licenseModel/licenseModel.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbLicenseModelById,
  saveCmdbLicenseModel,
} from '../../../../store/cmdb/licenseModel/licenseModel.action';
import {
  clearCmdbLicenseModelGetById,
  clearCmdbLicenseModelMessages,
  cmdbLicenseModelSelector,
} from '../../../../store/cmdb/licenseModel/licenseModel.reducer';
import { clearBULookUp, clearCompanyLookUp } from '../../../../store/common/common.reducer';
import { IAddCmdbLicenseModelProps } from './addLicenseModel.model';

const AddCmdbLicenseModelModal: React.FC<IAddCmdbLicenseModelProps> = (props) => {
  const cmdbLicenseModel = useAppSelector(cmdbLicenseModelSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbLicenseModel} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbLicenseModel = {
    name: '',
    publisher: '',
    description: '',
    metric: '',
    minimum: '',
    is_down_gradable: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbLicenseModel = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmdbLicenseModel(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmdbLicenseModel) => {
    if (data) {
      initialValues = {
        name: data.name,
        publisher: data.publisher,
        description: data.description,
        metric: data.metric,
        minimum: data.minimum,
        is_down_gradable: data.is_down_gradable,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbLicenseModel.save.messages.length > 0) {
      if (cmdbLicenseModel.save.hasErrors) {
        toast.error(cmdbLicenseModel.save.messages.join(' '));
      } else {
        toast.success(cmdbLicenseModel.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbLicenseModelMessages());
    }
  }, [cmdbLicenseModel.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmdbLicenseModel.getById.data) {
      const data = cmdbLicenseModel.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbLicenseModel.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getCmdbLicenseModelById(+id));
    }
    return () => {
      dispatch(clearCmdbLicenseModelGetById());
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
        {cmdbLicenseModel.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbLicenseModel.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbLicenseModel"
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
                    rules={[{ max: 200, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Publisher</label>
                  <Form.Item
                    name="publisher"
                    className="m-0"
                    label="Publisher"
                    rules={[{ max: 510 }]}
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
                    className="m-0"
                    label="Description"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Metric</label>
                  <Form.Item name="metric" className="m-0" label="Metric" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Minimum</label>
                  <Form.Item name="minimum" className="m-0" label="Minimum" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_down_gradable" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Downgradable</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbLicenseModel.save.loading}
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
export default AddCmdbLicenseModelModal;
