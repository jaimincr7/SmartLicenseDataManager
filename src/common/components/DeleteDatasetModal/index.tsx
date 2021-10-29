import { Button, Col, Form, Modal, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../services/common/common.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  deleteDataset,
  getAllCompanyLookup,
  getBULookup,
} from '../../../store/common/common.action';
import {
  clearBULookUp,
  clearDeleteDatasetMessages,
  commonSelector,
} from '../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import { Common, validateMessages } from '../../constants/common';
import { IInlineSearch } from '../../models/common';
import { IDeleteDatasetModalProps } from './deleteDatasetModal.model';
import _ from 'lodash';
import React from 'react';

const { Option } = Select;

const DeleteDatasetModal: React.FC<IDeleteDatasetModalProps> = (props) => {
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);

  const { showModal, handleModalClose, refreshDataTable, tableName, isDateAvailable, filterKeys } =
    props;

  const [form] = Form.useForm();
  const globalFilters = useAppSelector(globalSearchSelector);

  const showDate = isDateAvailable === undefined ? true : isDateAvailable;

  let initialValues = {
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

  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current > moment().endOf('day');
  // };

  useEffect(() => {
    if (common.deleteDataset.messages.length > 0) {
      if (common.deleteDataset.hasErrors) {
        toast.error(common.deleteDataset.messages.join(' '));
      } else {
        toast.success(common.deleteDataset.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearDeleteDatasetMessages());
    }
  }, [common.deleteDataset.messages]);

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
    if (globalSearch.company_id && globalSearch.bu_id) {
      dispatch(getBULookup(globalSearch?.company_id[0]));
      initialValues = {
        company_id: _.isNull(globalSearch.company_id) ? null : globalSearch?.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch?.bu_id[0],
        date_added:
          filterKeys?.filter_keys?.date_added?.length == 1
            ? moment(filterKeys.filter_keys.date_added[0]).format(Common.DATEFORMAT)
            : null,
      };
      form.setFieldsValue(initialValues);
    }
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
                  <Form.Item
                    name="date_added"
                    className="m-0"
                    label="Dataset Date"
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
                        <Option key={option} value={option}>
                          {moment(option).format(Common.DATEFORMAT)}
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
