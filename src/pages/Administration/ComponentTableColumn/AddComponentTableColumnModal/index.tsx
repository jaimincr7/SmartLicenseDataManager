import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigComponentTableColumn } from '../../../../services/master/componentTableColumn/componentTableColumn.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigComponentTableColumnById,
  saveConfigComponentTableColumn,
} from '../../../../store/master/componentTableColumn/componentTableColumn.action';
import {
  clearConfigComponentTableColumnGetById,
  clearConfigComponentTableColumnMessages,
  configComponentTableColumnSelector,
} from '../../../../store/master/componentTableColumn/componentTableColumn.reducer';
import { IAddConfigComponentTableColumnProps } from './addComponentTableColumn.model';
import { ILookup } from '../../../../services/common/common.model';
import { commonSelector } from '../../../../store/common/common.reducer';
import { getConfigComponentLookup } from '../../../../store/common/common.action';

const { Option } = Select;

const AddConfigComponentTableColumnModal: React.FC<IAddConfigComponentTableColumnProps> = (
  props
) => {
  const configComponentTableColumn = useAppSelector(configComponentTableColumnSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigComponentTableColumn} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigComponentTableColumn = {
    table_name: '',
    column_name: '',
    component_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigComponentTableColumn = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigComponentTableColumn(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigComponentTableColumn) => {
    if (data) {
      initialValues = {
        table_name: data.table_name,
        column_name: data.column_name,
        component_id: _.isNull(data.component_id) ? null : data.component_id,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configComponentTableColumn.save.messages.length > 0) {
      if (configComponentTableColumn.save.hasErrors) {
        toast.error(configComponentTableColumn.save.messages.join(' '));
      } else {
        toast.success(configComponentTableColumn.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigComponentTableColumnMessages());
    }
  }, [configComponentTableColumn.save.messages]);

  useEffect(() => {
    if (+id > 0 && configComponentTableColumn.getById.data) {
      const data = configComponentTableColumn.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configComponentTableColumn.getById.data]);

  useEffect(() => {
    dispatch(getConfigComponentLookup());
    if (+id > 0) {
      dispatch(getConfigComponentTableColumnById(+id));
    }
    return () => {
      dispatch(clearConfigComponentTableColumnGetById());
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
        {configComponentTableColumn.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configComponentTableColumn.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configComponentTableColumn"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Component</label>
                  <Form.Item
                    name="component_id"
                    className="m-0"
                    label="Component"
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configComponentLookup.loading}
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
                  <label className="label">Table Name</label>
                  <Form.Item
                    name="table_name"
                    label="Table Name"
                    className="m-0"
                    rules={[{ required: true, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Column Name</label>
                  <Form.Item
                    name="column_name"
                    label="Column Name"
                    className="m-0"
                    rules={[{ required: true, max: 500 }]}
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
                loading={configComponentTableColumn.save.loading}
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
export default AddConfigComponentTableColumnModal;
