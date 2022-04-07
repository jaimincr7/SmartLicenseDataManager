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
import {
  clearDeviceStateMessages,
  deviceStateSelector,
} from '../../../../store/inventory/deviceState/deviceState.reducer';
import { toast } from 'react-toastify';
import { Common, validateMessages } from '../../../../common/constants/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';
import _ from 'lodash';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  forDropDown,
  getandReturn,
  getScheduleDateHelperLookup,
  getSimpleDate,
  passDateToApi,
  showDateFromApi,
} from '../../../../common/helperFunction';
import { processDataDeviceState } from '../../../../store/inventory/deviceState/deviceState.action';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const deviceState = useAppSelector(deviceStateSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { showModal, handleModalClose, filterKeys, tableName } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: getSimpleDate(),
    update_device_states_inc_non_prod: false,
    update_device_states_by_keyword: false,
    x_ref_ad: false,
    ad_missing_assume_prod: false,
  };

  const onFinish = (values: any) => {
    values.date_added = passDateToApi(values.date_added, false);
    values.table_name = tableName;
    dispatch(processDataDeviceState(values));
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
      await dispatch(getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), 'Device')));
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
    if (deviceState.processData.messages.length > 0) {
      if (deviceState.processData.hasErrors) {
        toast.error(deviceState.processData.messages.join(' '));
      } else {
        toast.warning(deviceState.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearDeviceStateMessages());
    }
  }, [deviceState.processData.messages]);

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
    if (!buId) {
      dispatch(clearDateLookup());
    }
    if (buId) {
      dispatch(getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), 'Device')));
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
            ? getandReturn(filterKeys.filter_keys.date_added[0]).format(Common.DATEFORMAT)
            : null,
      };
      if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
        dispatch(getScheduleDate(getScheduleDateHelperLookup(filterValues, 'Device')));
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
                <label className="label">Selected Date</label>
                <Form.Item
                  name="date_added"
                  className="m-0"
                  label="Selected Date"
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
                <label className="label">Selected Date </label>
                <Form.Item name="date_added" label="Selected Date " className="m-0">
                  <DatePicker className="w-100" />
                </Form.Item>
              </div>
            </Col> */}
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="update_device_states_inc_non_prod"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update Device States INC Non-Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="update_device_states_by_keyword"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update Device States By Keyword</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_ad" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">X Ref AD</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="ad_missing_assume_prod" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">AD Missing Assume Prod</label>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={deviceState.processData.loading}
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
