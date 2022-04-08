import { Button, Col, Form, Modal, Row, Select, Switch } from 'antd';
import React, { useEffect } from 'react';
import {
  IConfigModelPopUpDataSelection,
  IGetConfigModelPopUpDataSelection,
  ILookup,
} from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  configModelPopUpDataSelection,
  getAllCompanyLookup,
  getBULookup,
  getConfigModelPopUpDataSelection,
  getScheduleDate,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearConfigModelPopUpDataSelection,
  clearDateLookup,
  cleargetModelPopUpDataSelection,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { processDataSqlServerInventory } from '../../../../store/sqlServer/sqlServerInventory/sqlServerInventory.action';
import {
  clearSqlServerInventoryMessages,
  sqlServerInventorySelector,
} from '../../../../store/sqlServer/sqlServerInventory/sqlServerInventory.reducer';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import {
  forDropDown,
  getScheduleDateHelperLookup,
  showDateFromApi,
} from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';
import _ from 'lodash';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const sqlServerInventory = useAppSelector(sqlServerInventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { showModal, handleModalClose, filterKeys, tableName } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: null,
    set_device_states: false,
    set_device_states_inc_non_prod: false,
    set_device_states_by_keyword: false,
    x_ref_ad: false,
    x_ref_azure: false,
    set_desktop_non_prod: false,
    update_rv_tools_vm: false,
    update_rv_tools_host: false,
    apply_overrides: false,
  };

  const onFinish = (values: any) => {
    dispatch(processDataSqlServerInventory(values));
  };

  const saveConfig = () => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.date_added;
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
        getScheduleDate(
          getScheduleDateHelperLookup(form.getFieldsValue(), sqlServerInventory.search.tableName)
        )
      );
    }
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (sqlServerInventory.processData.messages.length > 0) {
      if (sqlServerInventory.processData.hasErrors) {
        toast.error(sqlServerInventory.processData.messages.join(' '));
      } else {
        toast.warning(sqlServerInventory.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSqlServerInventoryMessages());
    }
  }, [sqlServerInventory.processData.messages]);

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

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null, date_added: null });
    dispatch(clearDateLookup());
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    if (buId) {
      dispatch(
        getScheduleDate(
          getScheduleDateHelperLookup(form.getFieldsValue(), sqlServerInventory.search.tableName)
        )
      );
    } else {
      dispatch(clearDateLookup());
    }

    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    return () => {
      dispatch(clearBULookUp());
      dispatch(clearDateLookup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (commonLookups.getModelPopUpSelection.data !== {}) {
      getConfigData(commonLookups.getModelPopUpSelection.data);
    }
  }, [commonLookups.getModelPopUpSelection.data]);

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
      globalSearch.company_id ||
      Object.keys(commonLookups.getModelPopUpSelection.data).length == 0
    ) {
      if (globalSearch.company_id) dispatch(getBULookup(globalSearch.company_id[0]));
      const filterValues = {
        company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) || !globalSearch.bu_id ? null : globalSearch.bu_id[0],
        date_added:
          filterKeys?.filter_keys?.date_added?.length === 1
            ? showDateFromApi(filterKeys.filter_keys.date_added[0])
            : null,
      };
      if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
        dispatch(
          getScheduleDate(
            getScheduleDateHelperLookup(filterValues, sqlServerInventory.search.tableName)
          )
        );
      }
      form.setFieldsValue(filterValues);
    }
    return () => {
      dispatch(cleargetModelPopUpDataSelection());
    };
  }, []);

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
            {/* <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  label="Date Added"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" disabledDate={disabledDate} />
                </Form.Item>
              </div>
            </Col> */}
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="set_device_states" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_inc_non_prod"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States Inc Non Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_by_keyword"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States By KeyWord</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_ad" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAD</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_azure" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAzure</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="set_desktop_non_prod" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Desktops Non Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_vm" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_VM</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_host" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_Host</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="apply_overrides" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Apply Overrides</label>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={sqlServerInventory.processData.loading}
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
