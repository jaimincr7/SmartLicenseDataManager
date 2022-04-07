import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  IConfigModelPopUpDataSelection,
  IGetConfigModelPopUpDataSelection,
  ILookup,
} from '../../../services/common/common.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  configModelPopUpDataSelection,
  deleteDataset,
  getAllCompanyLookup,
  getBULookup,
  getConfigModelPopUpDataSelection,
  getScheduleDate,
} from '../../../store/common/common.action';
import {
  clearBULookUp,
  clearConfigModelPopUpDataSelection,
  clearDateLookup,
  clearDeleteDatasetMessages,
  cleargetModelPopUpDataSelection,
  commonSelector,
} from '../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import { validateMessages } from '../../constants/common';
import { IInlineSearch } from '../../models/common';
import { IDeleteDatasetModalProps } from './deleteDatasetModal.model';
import _ from 'lodash';
import React from 'react';
import { forDropDown, getScheduleDateHelperLookup, passDateToApi } from '../../helperFunction';
import ability, { Can } from '../../ability';
import { Action, Page } from '../../constants/pageAction';

const { Option } = Select;

const DeleteDatasetModal: React.FC<IDeleteDatasetModalProps> = (props) => {
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);

  const { showModal, handleModalClose, tableName, isDateAvailable, filterKeys } = props;

  const [form] = Form.useForm();
  const globalFilters = useAppSelector(globalSearchSelector);

  const showDate = isDateAvailable === undefined ? true : isDateAvailable;

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: null,
  };

  const onFinish = (values: any) => {
    const inputValues = {
      ...values,
      table_name: tableName,
    };
    dispatch(deleteDataset(inputValues));
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
      pop_up_name: 'DeleteDataSet',
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
    }
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (common.deleteDataset.messages.length > 0) {
      if (common.deleteDataset.hasErrors) {
        toast.error(common.deleteDataset.messages.join(' '));
      } else {
        toast.warning(common.deleteDataset.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearDeleteDatasetMessages());
    }
  }, [common.deleteDataset.messages]);

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

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    if (buId) {
      dispatch(getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), tableName)));
    } else {
      dispatch(clearDateLookup());
    }
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    return () => {
      dispatch(clearBULookUp());
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
        pop_up_name: 'DeleteDataSet',
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
            ? passDateToApi(filterKeys.filter_keys.date_added[0])
            : null,
      };
      if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1)
        dispatch(getScheduleDate(getScheduleDateHelperLookup(filterValues, tableName)));
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
        title="Delete Dataset"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="deleteDataset"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company Name</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company Name"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company Name"
                    onChange={handleCompanyChange}
                    allowClear
                    loading={common.allCompanyLookup.loading}
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
                    {common.allCompanyLookup.data.map((option: ILookup) => (
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
                <label className="label">BU Name</label>
                <Form.Item
                  name="bu_id"
                  className="m-0"
                  label="BU Name"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select BU Name"
                    onChange={handleBUChange}
                    allowClear
                    loading={common.buLookup.loading}
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
                    {common.buLookup.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            {showDate && (
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Dataset Date</label>
                  <Form.Item name="date_added" className="m-0" label="Dataset Date">
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
                        <Option key={option} value={option}>
                          {forDropDown(option) == 'Invalid date' ? 'NULL' : forDropDown(option)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            )}
          </Row>
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={common.deleteDataset.loading}
            >
              Delete
            </Button>
            <Can I={Action.ModelDataSeletion} a={Page.ConfigModelPopUpSelection}>
              <Button
                type="dashed"
                ghost
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
export default DeleteDatasetModal;
