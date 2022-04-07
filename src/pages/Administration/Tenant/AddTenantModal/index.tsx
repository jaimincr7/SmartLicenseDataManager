import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ITenant } from '../../../../services/master/tenant/tenant.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getTenantById, saveTenant } from '../../../../store/master/tenant/tenant.action';
import {
  clearTenantGetById,
  clearTenantMessages,
  tenantSelector,
} from '../../../../store/master/tenant/tenant.reducer';
import { IAddTenantProps } from './addTenant.model';
import { getCurrencyLookup } from './../../../../store/common/common.action';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddTenantModal: React.FC<IAddTenantProps> = (props) => {
  const tenant = useAppSelector(tenantSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Tenant} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ITenant = {
    name: '',
    currency_id: undefined,
  };

  useEffect(() => {
    dispatch(getCurrencyLookup());
  }, []);

  const onFinish = (values: any) => {
    const inputValues: ITenant = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveTenant(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        tenant.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ITenant) => {
    if (data) {
      initialValues = {
        name: data.name,
        currency_id: data.currency_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (tenant.save.messages.length > 0) {
      if (tenant.save.hasErrors) {
        toast.error(tenant.save.messages.join(' '));
      } else {
        toast.success(tenant.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearTenantMessages());
    }
  }, [tenant.save.messages]);

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
    if (commonLookups.currencyLookup.data && commonLookups.currencyLookup.data.length) {
      const usdRecord = commonLookups.currencyLookup.data.filter(
        (data) => data.name.toLowerCase() == 'usd'
      );
      if (usdRecord && usdRecord.length) form.setFieldsValue({ currency_id: usdRecord[0].id });
    }
  }, [commonLookups.currencyLookup.data]);

  useEffect(() => {
    if (+id > 0 && tenant.getById.data) {
      const data = tenant.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tenant.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getTenantById(+id));
    }
    return () => {
      dispatch(clearTenantGetById());
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
        {tenant.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={tenant.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTenant"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Tenant Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tenant Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Tenant Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'currency_id']} valuePropName="checked" noStyle>
                      <Checkbox>Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Currency'
                  )}
                  <Form.Item name="currency_id" className="m-0" label="Currency">
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
                      loading={commonLookups.currencyLookup.loading}
                    >
                      {commonLookups.currencyLookup.data.map((option: ILookup) => (
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
                loading={tenant.save.loading || commonLookups.save.loading}
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
export default AddTenantModal;
