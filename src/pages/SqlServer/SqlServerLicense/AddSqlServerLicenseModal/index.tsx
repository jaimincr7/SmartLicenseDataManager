import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerLicense } from '../../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
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
import {
  getSqlServerLicenseById,
  saveSqlServerLicense,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import {
  clearSqlServerLicenseGetById,
  clearSqlServerLicenseMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import { IAddSqlServerLicenseProps } from './addSqlServerLicense.model';

const { Option } = Select;

const AddSqlServerLicenseModal: React.FC<IAddSqlServerLicenseProps> = (props) => {
  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SqlServerLicenseDetail} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISqlServerLicense = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    opt_agreement_type: null,
    opt_exclude_non_prod: false,
    opt_cluster_logic: false,
    opt_default_to_enterprise_on_hosts: false,
    notes: '',
    opt_entitlements: false,
    selected_date: moment(),
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerLicense = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSqlServerLicense(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        sqlServerLicense.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
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

  const fillValuesOnEdit = async (data: ISqlServerLicense) => {
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
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        opt_default_to_enterprise_on_hosts: data.opt_default_to_enterprise_on_hosts,
        opt_cluster_logic: data.opt_cluster_logic,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
        selected_date: _.isNull(data.selected_date) ? null : moment(data.selected_date),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (sqlServerLicense.save.messages.length > 0) {
      if (sqlServerLicense.save.hasErrors) {
        toast.error(sqlServerLicense.save.messages.join(' '));
      } else {
        toast.success(sqlServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSqlServerLicenseMessages());
    }
  }, [sqlServerLicense.save.messages]);

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
    if (+id > 0 && sqlServerLicense.getById.data) {
      const data = sqlServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [sqlServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getAgreementTypesLookup());
    if (+id > 0) {
      dispatch(getSqlServerLicenseById(+id));
    }
    return () => {
      dispatch(clearSqlServerLicenseGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
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
        {sqlServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addSqlServerLicense"
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
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: !isMultiple }]}
                  >
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
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: !isMultiple }]}
                  >
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
                  <Form.Item
                    name="bu_id"
                    className="m-0"
                    label="BU"
                    rules={[{ required: !isMultiple }]}
                  >
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
                    <Form.Item
                      name={['checked', 'opt_agreement_type']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Agreement Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Agreement Type'
                  )}
                  <Form.Item name="opt_agreement_type" className="m-0" label="Agreement Type">
                    <Select
                      loading={commonLookups.agreementTypesLookup.loading}
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
                    >
                      {commonLookups.agreementTypesLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'selected_date']} valuePropName="checked" noStyle>
                      <Checkbox>Selected Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Selected Date'
                  )}
                  <Form.Item
                    name="selected_date"
                    label="Selected Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_exclude_non_prod" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_cluster_logic" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_cluster_logic']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OPT Cluster Logic</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Cluster Logic'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_enterprise_on_hosts"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_default_to_enterprise_on_hosts']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OPT Default to Enterprise on Hosts</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Default to Enterprise on Hosts'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_entitlements" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_entitlements']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OPT Entitlements</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Entitlements'
                  )}
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'notes']} valuePropName="checked" noStyle>
                      <Checkbox>Notes</Checkbox>
                    </Form.Item>
                  ) : (
                    'Notes'
                  )}
                  <Form.Item
                    name="notes"
                    label="Notes"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input.TextArea className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={sqlServerLicense.save.loading || commonLookups.save.loading}
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
export default AddSqlServerLicenseModal;
