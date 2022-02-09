import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigExclusionType } from '../../../../services/master/exclusionType/exclusionType.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigExclusionTypeById,
  saveConfigExclusionType,
} from '../../../../store/master/exclusionType/exclusionType.action';
import {
  clearConfigExclusionTypeGetById,
  clearConfigExclusionTypeMessages,
  configExclusionTypeSelector,
} from '../../../../store/master/exclusionType/exclusionType.reducer';
import { IAddConfigExclusionTypeProps } from './addExclusionType.model';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddConfigExclusionTypeModal: React.FC<IAddConfigExclusionTypeProps> = (props) => {
  const configExclusionType = useAppSelector(configExclusionTypeSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigExclusionType} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigExclusionType = {
    name: '',
    is_enabled: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigExclusionType = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigExclusionType(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configExclusionType.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigExclusionType) => {
    if (data) {
      initialValues = {
        name: data.name,
        is_enabled: data.is_enabled,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configExclusionType.save.messages.length > 0) {
      if (configExclusionType.save.hasErrors) {
        toast.error(configExclusionType.save.messages.join(' '));
      } else {
        toast.success(configExclusionType.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigExclusionTypeMessages());
    }
  }, [configExclusionType.save.messages]);

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
    if (+id > 0 && configExclusionType.getById.data) {
      const data = configExclusionType.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configExclusionType.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigExclusionTypeById(+id));
    }
    return () => {
      dispatch(clearConfigExclusionTypeGetById());
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
        {configExclusionType.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configExclusionType.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configExclusionType"
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
                loading={configExclusionType.save.loading || common.save.loading}
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
export default AddConfigExclusionTypeModal;
