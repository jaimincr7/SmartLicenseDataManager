import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigSqlServerEditions } from '../../../../services/master/sqlServerEditions/sqlServerEditions.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import { clearMultipleUpdateMessages, commonSelector } from '../../../../store/common/common.reducer';
import {
  getConfigSqlServerEditionsById,
  saveConfigSqlServerEditions,
} from '../../../../store/master/sqlServerEditions/sqlServerEditions.action';
import {
  clearConfigSqlServerEditionsGetById,
  clearConfigSqlServerEditionsMessages,
  configSqlServerEditionsSelector,
} from '../../../../store/master/sqlServerEditions/sqlServerEditions.reducer';
import { IAddConfigSqlServerEditionsProps } from './addSqlServerEditions.model';

const AddConfigSqlServerEditionsModal: React.FC<IAddConfigSqlServerEditionsProps> = (props) => {
  const configSqlServerEditions = useAppSelector(configSqlServerEditionsSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigSqlServerEditions} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigSqlServerEditions = {
    id: null,
    edition: '',
    licensable: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigSqlServerEditions = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigSqlServerEditions(inputValues));
    } else {
      const Obj: any = {
        ...valuesForSelection,
      };
      const rowList = {
        ...Obj.selectedIds,
      };
      const bu1 = {};
      for (const x in inputValues.checked) {
        if (inputValues.checked[x] === true) {
          bu1[x] = inputValues[x];
        }
      }
      if (Object.keys(bu1).length === 0) {
        toast.error('Please select at least 1 field to update');
        return;
      }
      const objectForSelection = {
        table_name: configSqlServerEditions.search.tableName,
        update_data: bu1,
        filterKeys: Obj.filterKeys,
        is_export_to_excel: false,
        keyword: Obj.keyword,
        limit: Obj.limit,
        offset: Obj.offset,
        order_by: Obj.order_by,
        current_user: {},
        order_direction: Obj.order_direction,
      };
      objectForSelection['selectedIds'] = rowList.selectedRowList;
      dispatch(updateMultiple(objectForSelection));
    }
  };

  const fillValuesOnEdit = async (data: IConfigSqlServerEditions) => {
    if (data) {
      initialValues = {
        id: data.id,
        edition: data.edition,
        licensable: data.licensable,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configSqlServerEditions.save.messages.length > 0) {
      if (configSqlServerEditions.save.hasErrors) {
        toast.error(configSqlServerEditions.save.messages.join(' '));
      } else {
        toast.success(configSqlServerEditions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigSqlServerEditionsMessages());
    }
  }, [configSqlServerEditions.save.messages]);

  useEffect(() => {
    if (common.save.messages.length > 0) {
      if (common.save.hasErrors) {
        toast.error(common.save.messages.join(' '));
      } else {
        toast.success(common.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [common.save.messages]);

  useEffect(() => {
    if (+id > 0 && configSqlServerEditions.getById.data) {
      const data = configSqlServerEditions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configSqlServerEditions.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigSqlServerEditionsById(+id));
    }
    return () => {
      dispatch(clearConfigSqlServerEditionsGetById());
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
        {configSqlServerEditions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configSqlServerEditions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configSqlServerEditions"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'edition']} valuePropName="checked" noStyle>
                      <Checkbox>Edition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition'
                  )}
                  <Form.Item
                    name="edition"
                    label="Edition"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="licensable" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'licensable']} valuePropName="checked" noStyle>
                      <Checkbox>Licensable</Checkbox>
                    </Form.Item>
                  ) : (
                    'Licensable'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configSqlServerEditions.save.loading || common.save.loading}
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
export default AddConfigSqlServerEditionsModal;
