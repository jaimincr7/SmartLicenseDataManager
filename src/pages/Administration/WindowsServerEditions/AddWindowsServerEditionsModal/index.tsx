import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigWindowsServerEditions } from '../../../../services/master/windowsServerEditions/windowsServerEditions.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/master/bu/bu.action';
import {
  getConfigWindowsServerEditionsById,
  saveConfigWindowsServerEditions,
} from '../../../../store/master/windowsServerEditions/windowsServerEditions.action';
import {
  clearConfigWindowsServerEditionsGetById,
  clearConfigWindowsServerEditionsMessages,
  configWindowsServerEditionsSelector,
} from '../../../../store/master/windowsServerEditions/windowsServerEditions.reducer';
import { IAddConfigWindowsServerEditionsProps } from './addWindowsServerEditions.model';

const AddConfigWindowsServerEditionsModal: React.FC<IAddConfigWindowsServerEditionsProps> = (
  props
) => {
  const configWindowsServerEditions = useAppSelector(configWindowsServerEditionsSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigWindowsServerEditions} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigWindowsServerEditions = {
    edition: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigWindowsServerEditions = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigWindowsServerEditions(inputValues));
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
        table_name: 'BU',
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

  const fillValuesOnEdit = async (data: IConfigWindowsServerEditions) => {
    if (data) {
      initialValues = {
        edition: data.edition,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configWindowsServerEditions.save.messages.length > 0) {
      if (configWindowsServerEditions.save.hasErrors) {
        toast.error(configWindowsServerEditions.save.messages.join(' '));
      } else {
        toast.success(configWindowsServerEditions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigWindowsServerEditionsMessages());
    }
  }, [configWindowsServerEditions.save.messages]);

  useEffect(() => {
    if (+id > 0 && configWindowsServerEditions.getById.data) {
      const data = configWindowsServerEditions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configWindowsServerEditions.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigWindowsServerEditionsById(+id));
    }
    return () => {
      dispatch(clearConfigWindowsServerEditionsGetById());
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
        {configWindowsServerEditions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configWindowsServerEditions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configWindowsServerEditions"
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configWindowsServerEditions.save.loading}
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
export default AddConfigWindowsServerEditionsModal;
