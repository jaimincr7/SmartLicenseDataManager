import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import _ from 'lodash';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAllCompanyLookup,
  getBULookup,
  getScheduleDate,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearDateLookup,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IReRunAllScenariosModalProps } from './reRunAllScenarios.model';
import { reRunAllScenariosWindows } from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import { toast } from 'react-toastify';
import {
  clearWindowsServerLicenseReRunAllScenariosMessages,
  windowsServerLicenseSelector,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import { validateMessages } from '../../../../common/constants/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { getScheduleDateHelperLookup, passDateToApi } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const ReRunAllScenariosModal: React.FC<IReRunAllScenariosModalProps> = (props) => {
  const windowsServersLicense = useAppSelector(windowsServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { showModal, handleModalClose, filterKeys } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: globalFilters.search.company_id !== 0 ? globalFilters.search.company_id : null,
    bu_id: globalFilters.search.bu_id !== 0 ? globalFilters.search.bu_id : null,
    selected_date: null,
  };

  const onFinish = (values: any) => {
    dispatch(reRunAllScenariosWindows(values));
  };

  useEffect(() => {
    if (windowsServersLicense.reRunAllScenariosWindows.messages.length > 0) {
      if (windowsServersLicense.reRunAllScenariosWindows.hasErrors) {
        toast.error(windowsServersLicense.reRunAllScenariosWindows.messages.join(' '));
      } else {
        toast.warning(windowsServersLicense.reRunAllScenariosWindows.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearWindowsServerLicenseReRunAllScenariosMessages());
    }
  }, [windowsServersLicense.reRunAllScenariosWindows.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null, selected_date: null });
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
          getScheduleDateHelperLookup(form.getFieldsValue(), windowsServersLicense.search.tableName)
        )
      );
    } else {
      dispatch(clearDateLookup());
    }
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    if (globalFilters.search.company_id !== 0 && globalFilters.search.company_id)
      dispatch(getBULookup(globalFilters.search.company_id));
    return () => {
      dispatch(clearDateLookup());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    if (globalSearch.company_id) dispatch(getBULookup(globalSearch.company_id[0]));
    const filterValues = {
      company_id:
        _.isNull(globalSearch.company_id) || globalSearch.company_id == undefined
          ? null
          : globalSearch.company_id[0],
      bu_id:
        _.isNull(globalSearch.bu_id) || globalSearch.bu_id == undefined
          ? null
          : globalSearch.bu_id[0],
      selected_date:
        filterKeys?.filter_keys?.date_added?.length === 1
          ? passDateToApi(filterKeys.filter_keys.date_added[0])
          : null,
    };
    if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
      dispatch(
        getScheduleDate(
          getScheduleDateHelperLookup(filterValues, windowsServersLicense.search.tableName)
        )
      );
    }
    form.setFieldsValue(filterValues);
  }, []);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Re-Run Scenarios"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="reRunAllScenarios"
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
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company Name"
                    loading={commonLookups.allCompanyLookup.loading}
                    onChange={handleCompanyChange}
                    allowClear
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
                <label className="label">BU Name</label>
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU Name"
                    loading={commonLookups.buLookup.loading}
                    onChange={handleBUChange}
                    allowClear
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
                  name="selected_date"
                  label="Selected Date"
                  className="m-0"
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
                      <Option key={option} value={passDateToApi(option)}>
                        {passDateToApi(option)?.toString() == 'Invalid date'
                          ? 'NULL'
                          : passDateToApi(option)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={windowsServersLicense.reRunAllScenariosWindows.loading}
            >
              Process
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
export default ReRunAllScenariosModal;
