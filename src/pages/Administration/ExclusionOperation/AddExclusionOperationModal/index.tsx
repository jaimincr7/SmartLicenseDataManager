import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigExclusionOperation } from '../../../../services/master/exclusionOperation/exclusionOperation.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigExclusionOperationById,
  saveConfigExclusionOperation,
} from '../../../../store/master/exclusionOperation/exclusionOperation.action';
import {
  clearConfigExclusionOperationGetById,
  clearConfigExclusionOperationMessages,
  configExclusionOperationSelector,
} from '../../../../store/master/exclusionOperation/exclusionOperation.reducer';
import { IAddConfigExclusionOperationProps } from './addExclusionOperation.model';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddConfigExclusionOperationModal: React.FC<IAddConfigExclusionOperationProps> = (props) => {
  const configExclusionOperation = useAppSelector(configExclusionOperationSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigExclusionOperation} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigExclusionOperation = {
    name: '',
    is_enabled: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigExclusionOperation = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigExclusionOperation(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configExclusionOperation.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigExclusionOperation) => {
    if (data) {
      initialValues = {
        name: data.name,
        logical_operation: data.logical_operation,
        sql_operation: data.sql_operation,
        is_enabled: data.is_enabled,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configExclusionOperation.save.messages.length > 0) {
      if (configExclusionOperation.save.hasErrors) {
        toast.error(configExclusionOperation.save.messages.join(' '));
      } else {
        toast.success(configExclusionOperation.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigExclusionOperationMessages());
    }
  }, [configExclusionOperation.save.messages]);

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
    if (+id > 0 && configExclusionOperation.getById.data) {
      const data = configExclusionOperation.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configExclusionOperation.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigExclusionOperationById(+id));
    }
    return () => {
      dispatch(clearConfigExclusionOperationGetById());
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
        {configExclusionOperation.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configExclusionOperation.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configExclusionOperation"
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
                    rules={[{ required: !isMultiple, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'logical_operation']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Logical Operation</Checkbox>
                    </Form.Item>
                  ) : (
                    'Logical Operation'
                  )}
                  <Form.Item name="logical_operation" label="Logical Operation" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sql_operation']} valuePropName="checked" noStyle>
                      <Checkbox>SQL Operation</Checkbox>
                    </Form.Item>
                  ) : (
                    'SQL Operation'
                  )}
                  <Form.Item name="sql_operation" label="SQL Operation" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Is Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Enabled'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configExclusionOperation.save.loading || common.save.loading}
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
export default AddConfigExclusionOperationModal;
