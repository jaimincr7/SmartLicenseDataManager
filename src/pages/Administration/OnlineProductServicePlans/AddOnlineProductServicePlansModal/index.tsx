import { Button, Checkbox, Col, Form, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { IConfigOnlineProductServicePlans } from '../../../../services/master/onlineProductServicePlans/onlineProductServicePlans.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigOnlineProductsLookup,
  getConfigOnlineServicePlansLookup,
} from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigOnlineProductServicePlansById,
  saveConfigOnlineProductServicePlans,
} from '../../../../store/master/onlineProductServicePlans/onlineProductServicePlans.action';
import {
  clearConfigOnlineProductServicePlansGetById,
  clearConfigOnlineProductServicePlansMessages,
  configOnlineProductServicePlansSelector,
} from '../../../../store/master/onlineProductServicePlans/onlineProductServicePlans.reducer';
import { IAddConfigOnlineProductServicePlansProps } from './addOnlineProductServicePlans.model';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigOnlineProductServicePlansModal: React.FC<IAddConfigOnlineProductServicePlansProps> =
  (props) => {
    const configOnlineProductServicePlans = useAppSelector(configOnlineProductServicePlansSelector);
    const dispatch = useAppDispatch();
    const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
      props;

    const commonLookups = useAppSelector(commonSelector);

    const isNew: boolean = id || isMultiple ? false : true;
    const title = useMemo(() => {
      return (
        <>
          {isNew ? 'Add ' : 'Edit '}{' '}
          <BreadCrumbs pageName={Page.ConfigOnlineProductServicePlans} level={1} />
        </>
      );
    }, [isNew]);
    const submitButtonText = useMemo(() => {
      return isNew ? 'Save' : 'Update';
    }, [isNew]);

    const [form] = Form.useForm();

    let initialValues: IConfigOnlineProductServicePlans = {
      product_id: null,
      service_plan_id: null,
    };

    const onFinish = (values: any) => {
      const inputValues: IConfigOnlineProductServicePlans = {
        ...values,
        id: id ? +id : null,
      };
      if (!isMultiple) {
        dispatch(saveConfigOnlineProductServicePlans(inputValues));
      } else {
        const result = getObjectForUpdateMultiple(
          valuesForSelection,
          inputValues,
          configOnlineProductServicePlans.search.tableName
        );
        if (result) {
          dispatch(updateMultiple(result));
        }
      }
    };

    const fillValuesOnEdit = async (data: IConfigOnlineProductServicePlans) => {
      if (data) {
        initialValues = {
          product_id: _.isNull(data.product_id) ? null : data.product_id,
          service_plan_id: _.isNull(data.service_plan_id) ? null : data.service_plan_id,
        };
        form.setFieldsValue(initialValues);
      }
    };

    useEffect(() => {
      if (configOnlineProductServicePlans.save.messages.length > 0) {
        if (configOnlineProductServicePlans.save.hasErrors) {
          toast.error(configOnlineProductServicePlans.save.messages.join(' '));
        } else {
          toast.success(configOnlineProductServicePlans.save.messages.join(' '));
          handleModalClose();
          refreshDataTable();
        }
        dispatch(clearConfigOnlineProductServicePlansMessages());
      }
    }, [configOnlineProductServicePlans.save.messages]);

    useEffect(() => {
      if (commonLookups.save.messages.length > 0) {
        if (commonLookups.save.hasErrors) {
          toast.error(commonLookups.save.messages.join(' '));
        } else {
          toast.success(commonLookups.save.messages.join(' '));
          handleModalClose();
          refreshDataTable();
        }
        dispatch(clearMultipleUpdateMessages());
      }
    }, [commonLookups.save.messages]);

    useEffect(() => {
      if (+id > 0 && configOnlineProductServicePlans.getById.data) {
        const data = configOnlineProductServicePlans.getById.data;
        fillValuesOnEdit(data);
      }
    }, [configOnlineProductServicePlans.getById.data]);

    useEffect(() => {
      dispatch(getConfigOnlineProductsLookup());
      dispatch(getConfigOnlineServicePlansLookup());
      if (+id > 0) {
        dispatch(getConfigOnlineProductServicePlansById(+id));
      }
      return () => {
        dispatch(clearConfigOnlineProductServicePlansGetById());
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
          {configOnlineProductServicePlans.getById.loading ? (
            <div className="spin-loader">
              <Spin spinning={configOnlineProductServicePlans.getById.loading} />
            </div>
          ) : (
            <Form
              form={form}
              name="configOnlineProductServicePlans"
              initialValues={initialValues}
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
              <Row gutter={[30, 15]} className="form-label-hide">
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    {isMultiple ? (
                      <Form.Item name={['checked', 'product_id']} valuePropName="checked" noStyle>
                        <Checkbox>Product</Checkbox>
                      </Form.Item>
                    ) : (
                      'Product'
                    )}
                    <Form.Item
                      name="product_id"
                      className="m-0"
                      label="Product"
                      rules={[{ required: !isMultiple }]}
                    >
                      <Select
                        allowClear
                        loading={commonLookups.configOnlineProductsLookup.loading}
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
                      >
                        {commonLookups.configOnlineProductsLookup.data.map((option: ILookup) => (
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
                        name={['checked', 'service_plan_id']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Service Plan</Checkbox>
                      </Form.Item>
                    ) : (
                      'Service Plan'
                    )}
                    <Form.Item
                      name="service_plan_id"
                      className="m-0"
                      label="Service Plan"
                      rules={[{ required: !isMultiple }]}
                    >
                      <Select
                        allowClear
                        dropdownClassName="value-box-select"
                        loading={commonLookups.configOnlineServicePlansLookup.loading}
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
                        {commonLookups.configOnlineServicePlansLookup.data.map(
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
                  loading={
                    configOnlineProductServicePlans.save.loading || commonLookups.save.loading
                  }
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
export default AddConfigOnlineProductServicePlansModal;
