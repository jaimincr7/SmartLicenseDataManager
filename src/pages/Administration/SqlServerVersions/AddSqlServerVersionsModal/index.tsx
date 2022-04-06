import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { IConfigSqlServerVersions } from '../../../../services/master/sqlServerVersions/sqlServerVersions.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getConfigSupportTypesLookup } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigSqlServerVersionsById,
  saveConfigSqlServerVersions,
} from '../../../../store/master/sqlServerVersions/sqlServerVersions.action';
import {
  clearConfigSqlServerVersionsGetById,
  clearConfigSqlServerVersionsMessages,
  configSqlServerVersionsSelector,
} from '../../../../store/master/sqlServerVersions/sqlServerVersions.reducer';
import { IAddConfigSqlServerVersionsProps } from './addSqlServerVersions.model';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigSqlServerVersionsModal: React.FC<IAddConfigSqlServerVersionsProps> = (props) => {
  const configSqlServerVersions = useAppSelector(configSqlServerVersionsSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;
  const commonLookups = useAppSelector(commonSelector);

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigSqlServerVersions} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigSqlServerVersions = {
    version: '',
    support_type_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigSqlServerVersions = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigSqlServerVersions(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configSqlServerVersions.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigSqlServerVersions) => {
    if (data) {
      initialValues = {
        version: data.version,
        support_type_id: _.isNull(data.support_type_id) ? null : data.support_type_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configSqlServerVersions.save.messages.length > 0) {
      if (configSqlServerVersions.save.hasErrors) {
        toast.error(configSqlServerVersions.save.messages.join(' '));
      } else {
        toast.success(configSqlServerVersions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigSqlServerVersionsMessages());
    }
  }, [configSqlServerVersions.save.messages]);

  useEffect(() => {
    if (commonLookups.save.messages.length > 0) {
      if (commonLookups.save.hasErrors) {
        toast.error(commonLookups.save.messages.join(' '));
      } else {
        toast.warn(commonLookups.save.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [commonLookups.save.messages]);

  useEffect(() => {
    if (+id > 0 && configSqlServerVersions.getById.data) {
      const data = configSqlServerVersions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configSqlServerVersions.getById.data]);

  useEffect(() => {
    dispatch(getConfigSupportTypesLookup());
    if (+id > 0) {
      dispatch(getConfigSqlServerVersionsById(+id));
    }
    return () => {
      dispatch(clearConfigSqlServerVersionsGetById());
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
        {configSqlServerVersions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configSqlServerVersions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configSqlServerVersions"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'version']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item
                    name="version"
                    label="Version"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'support_type_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Support Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Support Type'
                  )}
                  <Form.Item
                    name="support_type_id"
                    className="m-0"
                    label="Support Type"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configSupportTypesLookup.loading}
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
                      {commonLookups.configSupportTypesLookup.data.map((option: ILookup) => (
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
                loading={configSqlServerVersions.save.loading || commonLookups.save.loading}
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
export default AddConfigSqlServerVersionsModal;
