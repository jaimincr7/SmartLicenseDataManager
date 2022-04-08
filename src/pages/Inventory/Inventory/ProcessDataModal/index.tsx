import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  IConfigModelPopUpDataSelection,
  IGetConfigModelPopUpDataSelection,
  ILookup,
} from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  configModelPopUpDataSelection,
  getAgreementTypesLookup,
  getAllCompanyLookup,
  getBULookup,
  getConfigModelPopUpDataSelection,
  getScheduleDate,
  getScheduleDateforSqlServer,
  getScheduleDateforWindowsServer,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearConfigModelPopUpDataSelection,
  clearDateLookup,
  cleargetModelPopUpDataSelection,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { processDataInventory } from '../../../../store/inventory/inventory/inventory.action';
import {
  clearInventoryMessages,
  inventorySelector,
} from '../../../../store/inventory/inventory/inventory.reducer';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import {
  forDropDown,
  getScheduleDateHelperLookup,
  getSimpleDate,
  passDateToApi,
  showDateFromApi,
} from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';
import _ from 'lodash';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const inventory = useAppSelector(inventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [sql, setSql] = useState(false);
  const [windows, setWindows] = useState(false);

  const { showModal, handleModalClose, filterKeys, tableName } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: null,
    device_extract: false,
    normalize: true,
    sql_extract: false,
    windows_extract: false,
    sql_agreement_type: null,
    sql_exclude_non_prod: false,
    sql_cluster_logic: false,
    sql_default_to_enterprise_on_hosts: false,
    sql_entitlements: false,
    sql_notes: '',
    windows_include_sc: false,
    windows_agreement_type: null,
    windows_exclude_non_prod: false,
    windows_default_to_data_center_on_hosts: false,
    windows_entitlements: false,
    windows_notes: '',
    selected_date_extract: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    values.selected_date_extract = passDateToApi(values.selected_date_extract, false);
    values.date_added = passDateToApi(values.date_added, false);
    values =
      sql === false
        ? {
            ...values,
            sql_agreement_type: null,
            sql_exclude_non_prod: false,
            sql_cluster_logic: false,
            sql_default_to_enterprise_on_hosts: false,
            sql_entitlements: false,
            sql_notes: '',
          }
        : values;
    values =
      windows === false
        ? {
            ...values,
            windows_include_sc: false,
            windows_agreement_type: null,
            windows_exclude_non_prod: false,
            windows_default_to_data_center_on_hosts: false,
            windows_entitlements: false,
            windows_notes: '',
          }
        : values;
    dispatch(processDataInventory(values));
  };

  const saveConfig = () => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.date_added;
    delete fieldValues.selected_date_extract;
    const setModelSelection: IConfigModelPopUpDataSelection = {
      id:
        commonLookups.getModelPopUpSelection.id === null
          ? null
          : commonLookups.getModelPopUpSelection.id,
      selection: JSON.stringify(fieldValues),
      table_name: tableName,
      pop_up_name: 'ProcessDataSet',
      company_id: form.getFieldValue('company_id'),
      bu_id: form.getFieldValue('bu_id'),
    };
    dispatch(configModelPopUpDataSelection(setModelSelection));
  };

  const getConfigData = async (data: any) => {
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data.bu_id) {
      await dispatch(
        getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), tableName))
      );
      await dispatch(
        getScheduleDateforWindowsServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'Windows Server')
        )
      );
      await dispatch(
        getScheduleDateforSqlServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'SQL Server')
        )
      );
    }
    if (data.sql_extract) {
      setSql(data.sql_extract);
    }
    if (data.windows_extract) {
      setWindows(data.windows_extract);
    }
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (commonLookups.getModelPopUpSelection.data !== {}) {
      getConfigData(commonLookups.getModelPopUpSelection.data);
    }
  }, [commonLookups.getModelPopUpSelection.data]);

  useEffect(() => {
    if (commonLookups.setModelPopUpSelection.messages.length > 0) {
      if (commonLookups.setModelPopUpSelection.hasErrors) {
        toast.error(commonLookups.setModelPopUpSelection.messages.join(' '));
      } else {
        toast.success(commonLookups.setModelPopUpSelection.messages.join(' '));
      }
      dispatch(clearConfigModelPopUpDataSelection());
    }
  }, [commonLookups.setModelPopUpSelection.messages]);

  useEffect(() => {
    if (inventory.processData.messages.length > 0) {
      if (inventory.processData.hasErrors) {
        toast.error(inventory.processData.messages.join(' '));
      } else {
        toast.warning(inventory.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearInventoryMessages());
    }
  }, [inventory.processData.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    dispatch(clearDateLookup());
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    if (buId) {
      dispatch(getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), tableName)));
      dispatch(
        getScheduleDateforWindowsServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'Windows Server')
        )
      );
      dispatch(
        getScheduleDateforSqlServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'SQL Server')
        )
      );
    } else {
      dispatch(clearDateLookup());
    }

    form.setFieldsValue({ bu_id: buId });
  };

  const sqlChange = () => {
    setSql(!sql);
  };

  const windowsChange = () => {
    setWindows(!windows);
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    dispatch(getAgreementTypesLookup());
    return () => {
      dispatch(clearBULookUp());
      dispatch(clearDateLookup());
    };
  }, [dispatch]);

  React.useEffect(() => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    if (ability.can(Action.ModelDataSeletion, Page.ConfigModelPopUpSelection)) {
      const modelPopUp: IGetConfigModelPopUpDataSelection = {
        table_name: tableName,
        pop_up_name: 'ProcessDataSet',
        tenant_id:
          _.isNull(globalSearch.tenant_id) || !globalSearch.tenant_id
            ? null
            : globalSearch.tenant_id[0],
        company_id:
          _.isNull(globalSearch.company_id) || !globalSearch.company_id
            ? null
            : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) || !globalSearch.bu_id ? null : globalSearch.bu_id[0],
      };
      if (globalSearch.company_id && globalSearch.company_id[0] !== 0)
        dispatch(getConfigModelPopUpDataSelection(modelPopUp));
    }
    if (
      globalFilters.search.company_id ||
      Object.keys(commonLookups.getModelPopUpSelection.data).length == 0
    ) {
      if (globalSearch.company_id) dispatch(getBULookup(globalSearch.company_id[0]));
      const filterValues = {
        company_id:
          _.isNull(globalSearch.company_id) || !globalSearch.company_id
            ? null
            : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) || !globalSearch.bu_id ? null : globalSearch.bu_id[0],
        date_added:
          filterKeys?.filter_keys?.date_added?.length === 1
            ? showDateFromApi(filterKeys.filter_keys.date_added[0])
            : null,
      };
      if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
        dispatch(getScheduleDate(getScheduleDateHelperLookup(filterValues, tableName)));
      }
      dispatch(
        getScheduleDateforWindowsServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'Windows Server')
        )
      );
      dispatch(
        getScheduleDateforSqlServer(
          getScheduleDateHelperLookup(form.getFieldsValue(), 'SQL Server')
        )
      );
      form.setFieldsValue(filterValues);
    }
    return () => {
      dispatch(cleargetModelPopUpDataSelection());
    };
  }, []);

  const onAgreementChange = (e) => {
    const agreementName = commonLookups.agreementTypesLookup.data?.filter((data) => data.id === e);
    const text1 =
      form.getFieldValue('sql_default_to_enterprise_on_hosts') === true
        ? 'DC on Host'
        : 'Cost Optimized';
    const text2 =
      form.getFieldValue('sql_exclude_non_prod') === true ? 'Exclude Non-Prod' : 'Include Non-Prod';
    form.setFieldsValue({ sql_notes: agreementName[0]?.name + ' - ' + text1 + ' - ' + text2 });
  };

  const onWindowsAgreementChange = (e) => {
    const agreementName = commonLookups.agreementTypesLookup.data?.filter((data) => data.id === e);
    const text1 =
      form.getFieldValue('windows_default_to_data_center_on_hosts') === true
        ? 'DC on Host'
        : 'Cost Optimized';
    const text2 =
      form.getFieldValue('windows_exclude_non_prod') === true
        ? 'Exclude Non-Prod'
        : 'Include Non-Prod';
    form.setFieldsValue({ windows_notes: agreementName[0]?.name + ' - ' + text1 + ' - ' + text2 });
  };

  const defaultToEntHostChange = (e) => {
    if (
      form.getFieldValue('sql_agreement_type') !== null &&
      form.getFieldValue('sql_agreement_type') !== undefined
    ) {
      const text2 =
        form.getFieldValue('sql_exclude_non_prod') === true
          ? 'Exclude Non-Prod'
          : 'Include Non-Prod';
      if (e === true) {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('sql_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'DC on Host';
        form.setFieldsValue({ sql_notes: notes + ' - ' + text2 });
      } else {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('sql_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'Cost Optimized';
        form.setFieldsValue({ sql_notes: notes + ' - ' + text2 });
      }
    }
  };

  const defaultWindowsToEntHostChange = (e) => {
    if (
      form.getFieldValue('windows_agreement_type') !== null &&
      form.getFieldValue('windows_agreement_type') !== undefined
    ) {
      const text2 =
        form.getFieldValue('windows_exclude_non_prod') === true
          ? 'Exclude Non-Prod'
          : 'Include Non-Prod';
      if (e === true) {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('windows_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'DC on Host';
        form.setFieldsValue({ windows_notes: notes + ' - ' + text2 });
      } else {
        const agreementName = commonLookups.agreementTypesLookup.data?.filter(
          (data) => data.id === form.getFieldValue('windows_agreement_type')
        );
        const notes = agreementName[0]?.name + ' - ' + 'Cost Optimized';
        form.setFieldsValue({ windows_notes: notes + ' - ' + text2 });
      }
    }
  };

  const onExcludeChange = (e) => {
    if (
      form.getFieldValue('sql_agreement_type') !== null &&
      form.getFieldValue('sql_agreement_type') !== undefined
    ) {
      const agreementName = commonLookups.agreementTypesLookup.data?.filter(
        (data) => data.id === form.getFieldValue('sql_agreement_type')
      );
      const optstring =
        form.getFieldValue('sql_default_to_enterprise_on_hosts') === true
          ? 'DC on Host'
          : 'Cost Optimized';
      if (e === true) {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Exclude Non-Prod';
        form.setFieldsValue({ sql_notes: notes });
      } else {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Include Non-Prod';
        form.setFieldsValue({ sql_notes: notes });
      }
    }
  };

  const onWindowsExcludeChange = (e) => {
    if (
      form.getFieldValue('windows_agreement_type') !== null &&
      form.getFieldValue('windows_agreement_type') !== undefined
    ) {
      const agreementName = commonLookups.agreementTypesLookup.data?.filter(
        (data) => data.id === form.getFieldValue('windows_agreement_type')
      );
      const optstring =
        form.getFieldValue('windows_default_to_data_center_on_hosts') === true
          ? 'DC on Host'
          : 'Cost Optimized';
      if (e === true) {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Exclude Non-Prod';
        form.setFieldsValue({ windows_notes: notes });
      } else {
        const notes = agreementName[0]?.name + ' - ' + optstring + ' - ' + 'Include Non-Prod';
        form.setFieldsValue({ windows_notes: notes });
      }
    }
  };

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Process Data"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="processData"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company"
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
                <label className="label">BU</label>
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU"
                    loading={commonLookups.buLookup.loading}
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
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  className="m-0"
                  label="Date Added"
                  rules={[{ required: true }]}
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
              <div className="form-group m-0">
                <label className="label">Selected Date Extract</label>
                <Form.Item
                  name="selected_date_extract"
                  label="Selected Date"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="normalize" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Normalize</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="device_extract" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Device Extract</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="sql_extract" className="m-0" valuePropName="checked">
                  <Switch className="form-control" onChange={sqlChange} />
                </Form.Item>
                <label className="label">Sql Extract</label>
              </div>
            </Col>
          </Row>
          <hr />
          {sql ? (
            <>
              <Row gutter={[30, 15]} className="form-label-hide">
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">SQL Agreement Type</label>
                    <Form.Item
                      name="sql_agreement_type"
                      className="m-0"
                      rules={[{ required: sql }]}
                    >
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
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="sql_exclude_non_prod" className="m-0" valuePropName="checked">
                      <Switch className="form-control" onChange={onExcludeChange} />
                    </Form.Item>
                    <label className="label">Sql Exclude Non Prod</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="sql_cluster_logic" className="m-0" valuePropName="checked">
                      <Switch className="form-control" />
                    </Form.Item>
                    <label className="label">Sql Cluster Logic</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item
                      name="sql_default_to_enterprise_on_hosts"
                      className="m-0"
                      valuePropName="checked"
                    >
                      <Switch className="form-control" onChange={defaultToEntHostChange} />
                    </Form.Item>
                    <label className="label">Sql Default to Enterprise on Hosts</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="sql_entitlements" className="m-0" valuePropName="checked">
                      <Switch className="form-control" />
                    </Form.Item>
                    <label className="label">Sql Entitlements</label>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="form-group m-0">
                    <label className="label">Sql Notes</label>
                    <Form.Item name="sql_notes" className="m-0">
                      <Input.TextArea className="form-control" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <hr />
            </>
          ) : (
            <></>
          )}

          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="windows_extract" className="m-0" valuePropName="checked">
                  <Switch className="form-control" onChange={windowsChange} />
                </Form.Item>
                <label className="label">Windows Extract</label>
              </div>
            </Col>
            <br />
          </Row>
          <hr />

          {windows ? (
            <>
              <Row gutter={[30, 15]} className="form-label-hide">
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Windows Agreement Type</label>
                    <Form.Item
                      name="windows_agreement_type"
                      className="m-0"
                      rules={[{ required: windows }]}
                    >
                      <Select
                        loading={commonLookups.agreementTypesLookup.loading}
                        onChange={onWindowsAgreementChange}
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
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item
                      name="windows_exclude_non_prod"
                      className="m-0"
                      valuePropName="checked"
                    >
                      <Switch className="form-control" onChange={onWindowsExcludeChange} />
                    </Form.Item>
                    <label className="label">Windows Exclude Non Prod</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="windows_include_sc" className="m-0" valuePropName="checked">
                      <Switch className="form-control" />
                    </Form.Item>
                    <label className="label">Windows Include SC</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item
                      name="windows_default_to_data_center_on_hosts"
                      className="m-0"
                      valuePropName="checked"
                    >
                      <Switch className="form-control" onChange={defaultWindowsToEntHostChange} />
                    </Form.Item>
                    <label className="label">Windows Default to Enterprise on Hosts</label>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group form-inline-pt m-0">
                    <Form.Item name="windows_entitlements" className="m-0" valuePropName="checked">
                      <Switch className="form-control" />
                    </Form.Item>
                    <label className="label">Windows Entitlements</label>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="form-group m-0">
                    <label className="label">Windows Notes</label>
                    <Form.Item name="windows_notes" className="m-0">
                      <Input.TextArea className="form-control" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <hr />
            </>
          ) : (
            <></>
          )}

          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={inventory.processData.loading}
            >
              Process
            </Button>
            <Can I={Action.ModelDataSeletion} a={Page.ConfigModelPopUpSelection}>
              <Button
                type="dashed"
                ghost
                disabled={form.getFieldValue('company_id') === null}
                onClick={saveConfig}
                loading={commonLookups.setModelPopUpSelection.loading}
              >
                Save Configuration
              </Button>
            </Can>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ProcessDataModal;
