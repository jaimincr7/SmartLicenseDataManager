import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IConfigSupportTypes } from '../../../../services/master/supportTypes/supportTypes.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigSupportTypesById,
  saveConfigSupportTypes,
} from '../../../../store/master/supportTypes/supportTypes.action';
import {
  clearConfigSupportTypesGetById,
  clearConfigSupportTypesMessages,
  configSupportTypesSelector,
} from '../../../../store/master/supportTypes/supportTypes.reducer';
import { IAddConfigSupportTypesProps } from './addSupportTypes.model';

const AddConfigSupportTypesModal: React.FC<IAddConfigSupportTypesProps> = (props) => {
  const configSupportTypes = useAppSelector(configSupportTypesSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigSupportTypes} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigSupportTypes = {
    support_type: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigSupportTypes = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigSupportTypes(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configSupportTypes.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigSupportTypes) => {
    if (data) {
      initialValues = {
        support_type: data.support_type,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configSupportTypes.save.messages.length > 0) {
      if (configSupportTypes.save.hasErrors) {
        toast.error(configSupportTypes.save.messages.join(' '));
      } else {
        toast.success(configSupportTypes.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigSupportTypesMessages());
    }
  }, [configSupportTypes.save.messages]);

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
    if (+id > 0 && configSupportTypes.getById.data) {
      const data = configSupportTypes.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configSupportTypes.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigSupportTypesById(+id));
    }
    return () => {
      dispatch(clearConfigSupportTypesGetById());
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
        {configSupportTypes.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configSupportTypes.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configSupportTypes"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'support_type']} valuePropName="checked" noStyle>
                      <Checkbox>Support Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Support Type'
                  )}
                  <Form.Item
                    name="support_type"
                    label="Support Type"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
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
                loading={configSupportTypes.save.loading || common.save.loading}
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
export default AddConfigSupportTypesModal;
