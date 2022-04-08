import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddBackgroundProcessesProps } from './addBackgroundProcesses.model';
import {
  backgroundProcessesSelector,
  clearBackgroundProcessesGetById,
} from '../../../../store/backgroundProcesses/backgroundProcesses.reducer';
import { getBackgroundProcessesById } from '../../../../store/backgroundProcesses/backgroundProcesses.action';
import { IBackgroundProcesses } from '../../../../services/backgroundProcesses/backgroundProcesses.model';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddBackgroundProcessesModal: React.FC<IAddBackgroundProcessesProps> = (props) => {
  const backgroundProcesses = useAppSelector(backgroundProcessesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, isMultiple, valuesForSelection } = props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName="Background Processes" level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IBackgroundProcesses = {
    type: '',
    status: '',
    comment: '',
    json: '',
    start_date: '',
    complete_date: '',
    company_id: null,
    bu_id: null,
    tenant_id: null,
    user_id: null,
    date_added: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IBackgroundProcesses = {
      ...values,
      id: id ? +id : null,
    };

    const result = getObjectForUpdateMultiple(
      valuesForSelection,
      inputValues,
      backgroundProcesses.search.tableName
    );
    if (result) {
      dispatch(updateMultiple(result));
    }
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu_id: buId });
  };

  const fillValuesOnEdit = async (data) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        type: data.type,
        status: data.status,
        comment: data.comment,
        json: data.json,
        start_date: '',
        complete_date: '',
        user_id: _.isNull(data.user_id) ? null : data.user_id,
        date_added: '',
      };
      form.setFieldsValue(initialValues);
    }
  };

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
    if (+id > 0 && backgroundProcesses.getById.data) {
      const data = backgroundProcesses.getById.data;
      fillValuesOnEdit(data);
    }
  }, [backgroundProcesses.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getBackgroundProcessesById(+id));
    }
    return () => {
      dispatch(clearBackgroundProcessesGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id === 0 && !isMultiple) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      if (globalSearch.company_id) {
        dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        dispatch(getBULookup(globalSearch.company_id[0]));
        const initlValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initlValues);
      }
    }
  }, []);

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
        {backgroundProcesses.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={backgroundProcesses.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addBackgroundProcesses"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'tenant_id']} valuePropName="checked" noStyle>
                      <Checkbox>Tenant</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tenant'
                  )}
                  <Form.Item name="tenant_id" className="m-0" label="Tenant">
                    <Select
                      onChange={handleTenantChange}
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
                      loading={commonLookups.tenantLookup.loading}
                    >
                      {commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
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
                      loading={commonLookups.companyLookup.loading}
                    >
                      {commonLookups.companyLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'bu_id']} valuePropName="checked" noStyle>
                      <Checkbox>BU</Checkbox>
                    </Form.Item>
                  ) : (
                    'BU'
                  )}
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select
                      onChange={handleBUChange}
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
                      loading={commonLookups.buLookup.loading}
                    >
                      {commonLookups.buLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'condition']} valuePropName="checked" noStyle>
                      <Checkbox>Condition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Condition'
                  )}
                  <Form.Item
                    name="condition"
                    className="m-0"
                    label="Condition"
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'value']} valuePropName="checked" noStyle>
                      <Checkbox>Value</Checkbox>
                    </Form.Item>
                  ) : (
                    'Value'
                  )}
                  <Form.Item
                    name="value"
                    label="Value"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'instance_count']} valuePropName="checked" noStyle>
                      <Checkbox>Instance Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance Count'
                  )}
                  <Form.Item
                    name="instance_count"
                    label="Instance Count"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="desktop" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'desktop']} valuePropName="checked" noStyle>
                      <Checkbox>Desktop</Checkbox>
                    </Form.Item>
                  ) : (
                    'Desktop'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'server']} valuePropName="checked" noStyle>
                      <Checkbox>Server</Checkbox>
                    </Form.Item>
                  ) : (
                    'Server'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="unknown" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'unknown']} valuePropName="checked" noStyle>
                      <Checkbox>Unknown</Checkbox>
                    </Form.Item>
                  ) : (
                    'Unknown'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="decom" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'decom']} valuePropName="checked" noStyle>
                      <Checkbox>Decom</Checkbox>
                    </Form.Item>
                  ) : (
                    'Decom'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={commonLookups.save.loading}
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
export default AddBackgroundProcessesModal;
