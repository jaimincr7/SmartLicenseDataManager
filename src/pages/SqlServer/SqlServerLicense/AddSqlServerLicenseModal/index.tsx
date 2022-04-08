import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { TableNames, validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  forDropDown,
  forEditModal,
  getObjectForUpdateMultiple,
  getScheduleDateHelperLookup,
  passDateToApi,
  showDateFromApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerLicense } from '../../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getAllCompanyLookup,
  getBULookup,
  getCompanyLookup,
  getScheduleDate,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearDateLookup,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
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
  const globalFilters = useAppSelector(globalSearchSelector);

  const {
    id,
    showModal,
    handleModalClose,
    refreshDataTable,
    filterKeys,
    isMultiple,
    valuesForSelection,
    //tableName
  } = props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SqlServerLicense} level={1} />
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
    selected_date: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerLicense = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.selected_date = passDateToApi(inputValues.selected_date, false);
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

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    if (!buId) {
      dispatch(clearDateLookup());
    }
    if (buId) {
      dispatch(
        getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), TableNames.SqlServer))
      );
    }
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
        selected_date: _.isNull(data.selected_date) ? null : forEditModal(data.selected_date),
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
        toast.warn(commonLookups.save.messages.join(' '));
        handleModalClose();
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
    dispatch(getAllCompanyLookup());
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
          selected_date:
            filterKeys?.filter_keys?.date_added?.length === 1
              ? showDateFromApi(filterKeys.filter_keys.date_added[0])
              : null,
        };
        if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
          dispatch(getScheduleDate(getScheduleDateHelperLookup(initlValues, TableNames.SqlServer)));
        }
        form.setFieldsValue(initlValues);
      }
    }
  }, []);

  const onAgreementChange = (e) => {
    const agreementName = commonLookups.agreementTypesLookup.data?.filter((data) => data.id === e);
    const text1 =
      form.getFieldValue('opt_default_to_enterprise_on_hosts') === true
        ? 'DC on Host'
        : 'Cost Optimized';
    const text2 =
      form.getFieldValue('opt_exclude_non_prod') === true ? 'Exclude Non-Prod' : 'Include Non-Prod';
    form.setFieldsValue({ notes: agreementName[0]?.name + ' - ' + text1 + ' - ' + text2 });
  };

  const defaultToEntHostChange = (e) => {
    if (
      form.getFieldValue('opt_agreement_type') !== null &&
      form.getFieldValue('opt_agreement_type') !== undefined
    ) {
      const text2 =
        form.getFieldValue('opt_exclude_non_prod') === true
          ? 'Exclude Non-Prod'
          : 'Include Non-Prod';
      if (e === true) {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('opt_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'DC on Host';
        form.setFieldsValue({ notes: notes + ' - ' + text2 });
      } else {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('opt_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'Cost Optimized';
        form.setFieldsValue({ notes: notes + ' - ' + text2 });
      }
    }
  };

  const onExcludeChange = (e) => {
    if (
      form.getFieldValue('opt_agreement_type') !== null &&
      form.getFieldValue('opt_agreement_type') !== undefined
    ) {
      const agreementName = commonLookups.agreementTypesLookup.data?.filter(
        (data) => data.id === form.getFieldValue('opt_agreement_type')
      );
      const optstring =
        form.getFieldValue('opt_default_to_enterprise_on_hosts') === true
          ? 'DC on Host'
          : 'Cost Optimized';
      if (e === true) {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Exclude Non-Prod';
        form.setFieldsValue({ notes: notes });
      } else {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Include Non-Prod';
        form.setFieldsValue({ notes: notes });
      }
    }
  };

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
                      loading={commonLookups.allCompanyLookup.loading}
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
                    >
                      {commonLookups.allCompanyLookup.data.map((option: ILookup) => (
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
                      {Object.keys(commonLookups.buLookup.data).length > 0
                        ? commonLookups.buLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalBULookup?.data.map((option: ILookup) => (
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
                      onChange={onAgreementChange}
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
                    className="m-0"
                    label="Selected Date"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      placeholder="Select Date"
                      loading={commonLookups.getScheduledDate.loading}
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
                      {commonLookups.getScheduledDate.data.map((option: any) => (
                        <Option key={option} value={showDateFromApi(option)}>
                          {forDropDown(option) == 'Invalid date' ? 'NULL' : showDateFromApi(option)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_enterprise_on_hosts"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" onChange={defaultToEntHostChange} />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_default_to_enterprise_on_hosts']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Default to Enterprise on Hosts</Checkbox>
                    </Form.Item>
                  ) : (
                    'Default to Enterprise on Hosts'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_exclude_non_prod"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" onChange={onExcludeChange} />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_exclude_non_prod']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Exclude Non-Prod</Checkbox>
                    </Form.Item>
                  ) : (
                    'Exclude Non-Prod'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_cluster_logic" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_cluster_logic']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cluster Logic</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cluster Logic'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_entitlements" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_entitlements']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Entitlements</Checkbox>
                    </Form.Item>
                  ) : (
                    'Entitlements'
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
