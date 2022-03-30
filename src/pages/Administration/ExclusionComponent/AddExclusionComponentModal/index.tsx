import { Button, Checkbox, Col, Form, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigExclusionComponent } from '../../../../services/master/exclusionComponent/exclusionComponent.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigExclusionComponentById,
  saveConfigExclusionComponent,
} from '../../../../store/master/exclusionComponent/exclusionComponent.action';
import {
  clearConfigExclusionComponentGetById,
  clearConfigExclusionComponentMessages,
  configExclusionComponentSelector,
} from '../../../../store/master/exclusionComponent/exclusionComponent.reducer';
import { IAddConfigExclusionComponentProps } from './addExclusionComponent.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { ILookup } from '../../../../services/common/common.model';
import {
  getConfigComponentLookup,
  getConfigComponentTableColumnLookup,
} from '../../../../store/common/common.action';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigExclusionComponentModal: React.FC<IAddConfigExclusionComponentProps> = (props) => {
  const configExclusionComponent = useAppSelector(configExclusionComponentSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigExclusionComponent} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigExclusionComponent = {
    component_id: null,
    exclusion_id_component_table_column_id: null,
    exclusion_desc_component_table_column_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigExclusionComponent = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigExclusionComponent(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configExclusionComponent.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigExclusionComponent) => {
    if (data) {
      initialValues = {
        component_id: _.isNull(data.component_id) ? null : data.component_id,
        exclusion_id_component_table_column_id: _.isNull(
          data.exclusion_id_component_table_column_id
        )
          ? null
          : data.exclusion_id_component_table_column_id,
        exclusion_desc_component_table_column_id: _.isNull(
          data.exclusion_desc_component_table_column_id
        )
          ? null
          : data.exclusion_desc_component_table_column_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configExclusionComponent.save.messages.length > 0) {
      if (configExclusionComponent.save.hasErrors) {
        toast.error(configExclusionComponent.save.messages.join(' '));
      } else {
        toast.success(configExclusionComponent.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigExclusionComponentMessages());
    }
  }, [configExclusionComponent.save.messages]);

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
    if (+id > 0 && configExclusionComponent.getById.data) {
      const data = configExclusionComponent.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configExclusionComponent.getById.data]);

  useEffect(() => {
    dispatch(getConfigComponentLookup());
    dispatch(getConfigComponentTableColumnLookup());
    if (+id > 0) {
      dispatch(getConfigExclusionComponentById(+id));
    }
    return () => {
      dispatch(clearConfigExclusionComponentGetById());
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
        {configExclusionComponent.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configExclusionComponent.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configExclusionComponent"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'component_id']} valuePropName="checked" noStyle>
                      <Checkbox>Component</Checkbox>
                    </Form.Item>
                  ) : (
                    'Component'
                  )}
                  <Form.Item
                    name="component_id"
                    className="m-0"
                    label="Component"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
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
                      loading={commonLookups.configComponentLookup.loading}
                    >
                      {commonLookups.configComponentLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'exclusion_id_component_table_column_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exclusion Component Table Column</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclusion Component Table Column'
                  )}
                  <Form.Item
                    name="exclusion_id_component_table_column_id"
                    className="m-0"
                    label="Exclusion Component Table Column"
                  >
                    <Select
                      allowClear
                      showSearch
                      dropdownClassName="value-box-select"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.configComponentTableColumnLookup.loading}
                    >
                      {commonLookups.configComponentTableColumnLookup.data.map(
                        (option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'exclusion_desc_component_table_column_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exclusion Description Component Table Column</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclusion Description Component Table Column'
                  )}
                  <Form.Item
                    name="exclusion_desc_component_table_column_id"
                    className="m-0"
                    label="Exclusion Description Component Table Column"
                  >
                    <Select
                      allowClear
                      showSearch
                      dropdownClassName="value-box-select"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.configComponentTableColumnLookup.loading}
                    >
                      {commonLookups.configComponentTableColumnLookup.data.map(
                        (option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        )
                      )}
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
                loading={configExclusionComponent.save.loading || commonLookups.save.loading}
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
export default AddConfigExclusionComponentModal;
