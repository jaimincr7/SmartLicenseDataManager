import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
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
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbProcessorProps } from './addProcessor.model';

const AddCmdbProcessorModal: React.FC<IAddCmdbProcessorProps> = (props) => {
  const cmdbProcessor = useAppSelector(cmdbProcessorSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    if (!isMultiple) {
      dispatch(saveCmdbProcessor(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbProcessor.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
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
                    rules={[{ max: 200, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'manufacturer']} valuePropName="checked" noStyle>
                      <Checkbox>Manufacturer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Manufacturer'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'model']} valuePropName="checked" noStyle>
                      <Checkbox>Model</Checkbox>
                    </Form.Item>
                  ) : (
                    'Model'
                  )}
                  <Form.Item name="model" className="m-0" label="Model" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'family']} valuePropName="checked" noStyle>
                      <Checkbox>Family</Checkbox>
                    </Form.Item>
                  ) : (
                    'Family'
                  )}
                  <Form.Item name="family" className="m-0" label="Family" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'number_of_processors']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Number Of Processors</Checkbox>
                    </Form.Item>
                  ) : (
                    'Number Of Processors'
                  )}
                  <Form.Item
                    name="number_of_processors"
                    className="m-0"
                    label="Number Of Processors"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'number_of_logical_processors']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Number Of Logical Processors</Checkbox>
                    </Form.Item>
                  ) : (
                    'Number Of Logical Processors'
                  )}
                  <Form.Item
                    name="number_of_logical_processors"
                    className="m-0"
                    label="Number Of Logical Processors"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'number_of_cores']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Number Of Cores</Checkbox>
                    </Form.Item>
                  ) : (
                    'Number Of Cores'
                  )}
                  <Form.Item
                    name="number_of_cores"
                    className="m-0"
                    label="Number Of Cores"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hyper_threading']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hyper Threading</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hyper Threading'
                  )}
                  <Form.Item
                    name="hyper_threading"
                    className="m-0"
                    label="Hyper Threading"
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
                loading={cmdbProcessor.save.loading || common.save.loading}
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
