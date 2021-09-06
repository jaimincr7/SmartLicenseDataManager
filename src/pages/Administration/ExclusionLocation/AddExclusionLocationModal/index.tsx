import { Button, Col, Form, Modal, Row, Select, Spin, Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IConfigExclusionLocation } from '../../../../services/master/exclusionLocation/exclusionLocation.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigExclusionLocationById,
  saveConfigExclusionLocation,
} from '../../../../store/master/exclusionLocation/exclusionLocation.action';
import {
  clearConfigExclusionLocationGetById,
  clearConfigExclusionLocationMessages,
  configExclusionLocationSelector,
} from '../../../../store/master/exclusionLocation/exclusionLocation.reducer';
import { IAddConfigExclusionLocationProps } from './addExclusionLocation.model';
import { commonSelector } from '../../../../store/common/common.reducer';
import { ILookup } from '../../../../services/common/common.model';
import { getConfigComponentTableColumnLookup } from '../../../../store/common/common.action';

const { Option } = Select;

const AddConfigExclusionLocationModal: React.FC<IAddConfigExclusionLocationProps> = (props) => {
  const configExclusionLocation = useAppSelector(configExclusionLocationSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigExclusionLocation} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigExclusionLocation = {
    component_table_column_id: null,
    is_excludable: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigExclusionLocation = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfigExclusionLocation(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfigExclusionLocation) => {
    if (data) {
      initialValues = {
        component_table_column_id: _.isNull(data.component_table_column_id)
          ? null
          : data.component_table_column_id,
        is_excludable: data.is_excludable,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configExclusionLocation.save.messages.length > 0) {
      if (configExclusionLocation.save.hasErrors) {
        toast.error(configExclusionLocation.save.messages.join(' '));
      } else {
        toast.success(configExclusionLocation.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigExclusionLocationMessages());
    }
  }, [configExclusionLocation.save.messages]);

  useEffect(() => {
    if (+id > 0 && configExclusionLocation.getById.data) {
      const data = configExclusionLocation.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configExclusionLocation.getById.data]);

  useEffect(() => {
    dispatch(getConfigComponentTableColumnLookup());
    if (+id > 0) {
      dispatch(getConfigExclusionLocationById(+id));
    }
    return () => {
      dispatch(clearConfigExclusionLocationGetById());
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
        {configExclusionLocation.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configExclusionLocation.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configExclusionLocation"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Component Table Column</label>
                  <Form.Item
                    name="component_table_column_id"
                    className="m-0"
                    label="Component Table Column"
                    rules={[{ required: true }]}
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
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_excludable" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Excludable</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configExclusionLocation.save.loading}
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
export default AddConfigExclusionLocationModal;
