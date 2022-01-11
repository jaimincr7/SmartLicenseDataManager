import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IConfigSqlServerServices } from '../../../../services/master/sqlServerServices/sqlServerServices.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigSqlServerServicesById,
  saveConfigSqlServerServices,
} from '../../../../store/master/sqlServerServices/sqlServerServices.action';
import {
  clearConfigSqlServerServicesGetById,
  clearConfigSqlServerServicesMessages,
  configSqlServerServicesSelector,
} from '../../../../store/master/sqlServerServices/sqlServerServices.reducer';
import { IAddConfigSqlServerServicesProps } from './addSqlServerServices.model';

const AddConfigSqlServerServicesModal: React.FC<IAddConfigSqlServerServicesProps> = (props) => {
  const configSqlServerServices = useAppSelector(configSqlServerServicesSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigSqlServerServices} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigSqlServerServices = {
    id: null,
    service: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigSqlServerServices = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigSqlServerServices(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configSqlServerServices.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigSqlServerServices) => {
    if (data) {
      initialValues = {
        id: data.id,
        service: data.service,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configSqlServerServices.save.messages.length > 0) {
      if (configSqlServerServices.save.hasErrors) {
        toast.error(configSqlServerServices.save.messages.join(' '));
      } else {
        toast.success(configSqlServerServices.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigSqlServerServicesMessages());
    }
  }, [configSqlServerServices.save.messages]);

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
    if (+id > 0 && configSqlServerServices.getById.data) {
      const data = configSqlServerServices.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configSqlServerServices.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigSqlServerServicesById(+id));
    }
    return () => {
      dispatch(clearConfigSqlServerServicesGetById());
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
        {configSqlServerServices.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configSqlServerServices.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configSqlServerServices"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service']} valuePropName="checked" noStyle>
                      <Checkbox>Service</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service'
                  )}
                  <Form.Item
                    name="service"
                    label="Service"
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
                loading={configSqlServerServices.save.loading || common.save.loading}
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
export default AddConfigSqlServerServicesModal;
