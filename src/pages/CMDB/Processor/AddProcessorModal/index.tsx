import { Button, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbProcessor } from '../../../../services/cmdb/processor/processor.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbProcessorById,
  saveCmdbProcessor,
} from '../../../../store/cmdb/processor/processor.action';
import {
  clearCmdbProcessorGetById,
  clearCmdbProcessorMessages,
  cmdbProcessorSelector,
} from '../../../../store/cmdb/processor/processor.reducer';
import { getTenantLookup } from '../../../../store/common/common.action';
import { clearBULookUp, clearCompanyLookUp } from '../../../../store/common/common.reducer';
import { IAddCmdbProcessorProps } from './addProcessor.model';

const AddCmdbProcessorModal: React.FC<IAddCmdbProcessorProps> = (props) => {
  const cmdbProcessor = useAppSelector(cmdbProcessorSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbProcessor} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbProcessor = {
    name: '',
    manufacturer: '',
    model: '',
    family: '',
    number_of_processors: null,
    number_of_logical_processors: null,
    number_of_cores: null,
    hyper_threading: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbProcessor = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmdbProcessor(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmdbProcessor) => {
    if (data) {
      initialValues = {
        name: data.name,
        manufacturer: data.manufacturer,
        model: data.model,
        family: data.family,
        number_of_processors: data.number_of_processors,
        number_of_logical_processors: data.number_of_logical_processors,
        number_of_cores: data.number_of_logical_processors,
        hyper_threading: data.hyper_threading,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbProcessor.save.messages.length > 0) {
      if (cmdbProcessor.save.hasErrors) {
        toast.error(cmdbProcessor.save.messages.join(' '));
      } else {
        toast.success(cmdbProcessor.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbProcessorMessages());
    }
  }, [cmdbProcessor.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmdbProcessor.getById.data) {
      const data = cmdbProcessor.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbProcessor.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmdbProcessorById(+id));
    }
    return () => {
      dispatch(clearCmdbProcessorGetById());
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
        {cmdbProcessor.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbProcessor.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbProcessor"
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
                  <label className="label">Manufacturer</label>
                  <Form.Item
                    name="manufacturer"
                    className="m-0"
                    label="Manufacturer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Model</label>
                  <Form.Item name="model" className="m-0" label="Model" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Family</label>
                  <Form.Item name="family" className="m-0" label="Family" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Number Of Processors</label>
                  <Form.Item
                    name="number_of_processors"
                    className="m-0"
                    label="NumberOfProcessors"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Number Of Logical Processors</label>
                  <Form.Item
                    name="number_of_logical_processors"
                    className="m-0"
                    label="NumberOfLogicalProcessors"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Number Of Cores</label>
                  <Form.Item
                    name="number_of_cores"
                    className="m-0"
                    label="NumberOfCores"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hyper Threading</label>
                  <Form.Item
                    name="hyper_threading"
                    className="m-0"
                    label="HyperThreading"
                    rules={[{ max: 510 }]}
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
                loading={cmdbProcessor.save.loading}
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
export default AddCmdbProcessorModal;
