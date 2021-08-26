import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbApplication } from '../../../../services/cmdb/application/application.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbApplicationById,
  saveCmdbApplication,
} from '../../../../store/cmdb/application/application.action';
import {
  clearCmdbApplicationGetById,
  clearCmdbApplicationMessages,
  cmdbApplicationSelector,
} from '../../../../store/cmdb/application/application.reducer';
import { getCmdbLicenseModelLookup } from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { IAddCmdbApplicationProps } from './addApplication.model';

const { Option } = Select;

const AddCmdbApplicationModal: React.FC<IAddCmdbApplicationProps> = (props) => {
  const cmdbApplication = useAppSelector(cmdbApplicationSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;
  const commonLookups = useAppSelector(commonSelector);
  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbApplication} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbApplication = {
    name: '',
    publisher: '',
    version: '',
    edition: '',
    license_model_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbApplication = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmdbApplication(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmdbApplication) => {
    if (data) {
      initialValues = {
        name: data.name,
        publisher: data.publisher,
        version: data.version,
        edition: data.edition,
        license_model_id: data.license_model_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbApplication.save.messages.length > 0) {
      if (cmdbApplication.save.hasErrors) {
        toast.error(cmdbApplication.save.messages.join(' '));
      } else {
        toast.success(cmdbApplication.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbApplicationMessages());
    }
  }, [cmdbApplication.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmdbApplication.getById.data) {
      const data = cmdbApplication.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbApplication.getById.data]);

  useEffect(() => {
    dispatch(getCmdbLicenseModelLookup());
    if (+id > 0) {
      dispatch(getCmdbApplicationById(+id));
    }
    return () => {
      dispatch(clearCmdbApplicationGetById());
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
        {cmdbApplication.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbApplication.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbApplication"
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
                  <label className="label">Version</label>
                  <Form.Item name="version" className="m-0" label="Version" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Edition</label>
                  <Form.Item name="edition" className="m-0" label="Edition" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">License Model</label>
                  <Form.Item 
                  name="license_model_id" 
                  className="m-0" 
                  label="License Model"
                  rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.cmdbLicenseModelLookup.loading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                    >
                      {commonLookups.cmdbLicenseModelLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbApplication.save.loading}
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
export default AddCmdbApplicationModal;
