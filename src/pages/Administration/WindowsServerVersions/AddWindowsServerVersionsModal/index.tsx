import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { IConfigWindowsServerVersions } from '../../../../services/master/windowsServerVersions/windowsServerVersions.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigWindowsServerVersionsById,
  saveConfigWindowsServerVersions,
} from '../../../../store/master/windowsServerVersions/windowsServerVersions.action';
import { getConfigSupportTypesLookup } from '../../../../store/common/common.action';
import {
  clearConfigWindowsServerVersionsGetById,
  clearConfigWindowsServerVersionsMessages,
  configWindowsServerVersionsSelector,
} from '../../../../store/master/windowsServerVersions/windowsServerVersions.reducer';
import { IAddConfigWindowsServerVersionsProps } from './addWindowsServerVersions.model';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigWindowsServerVersionsModal: React.FC<IAddConfigWindowsServerVersionsProps> = (
  props
) => {
  const configWindowsServerVersions = useAppSelector(configWindowsServerVersionsSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigWindowsServerVersions} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigWindowsServerVersions = {
    id: null,
    version: '',
    support_type_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigWindowsServerVersions = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigWindowsServerVersions(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configWindowsServerVersions.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigWindowsServerVersions) => {
    if (data) {
      initialValues = {
        version: data.version,
        support_type_id: _.isNull(data.support_type_id) ? null : data.support_type_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configWindowsServerVersions.save.messages.length > 0) {
      if (configWindowsServerVersions.save.hasErrors) {
        toast.error(configWindowsServerVersions.save.messages.join(' '));
      } else {
        toast.success(configWindowsServerVersions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigWindowsServerVersionsMessages());
    }
  }, [configWindowsServerVersions.save.messages]);

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
    if (+id > 0 && configWindowsServerVersions.getById.data) {
      const data = configWindowsServerVersions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configWindowsServerVersions.getById.data]);

  useEffect(() => {
    dispatch(getConfigSupportTypesLookup());
    if (+id > 0) {
      dispatch(getConfigWindowsServerVersionsById(+id));
    }
    return () => {
      dispatch(clearConfigWindowsServerVersionsGetById());
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
        {configWindowsServerVersions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configWindowsServerVersions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configWindowsServerVersions"
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
                  <Form.Item name="version" label="Version" className="m-0" rules={[{ max: 255 }]}>
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
                loading={configWindowsServerVersions.save.loading || commonLookups.save.loading}
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
export default AddConfigWindowsServerVersionsModal;
