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
import { validateMessages } from '../../../../common/constants/common';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { IWindowsServerLicense } from '../../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getAllCompanyLookup,
  getBULookup,
  getCompanyLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import {
  getWindowsServerLicenseById,
  saveWindowsServerLicense,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import {
  clearWindowsServerLicenseGetById,
  clearWindowsServerLicenseMessages,
  windowsServerLicenseSelector,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import { IAddWindowsServerLicenseProps } from './addWindowsServerLicense.model';

const { Option } = Select;

const AddWindowsServerLicenseModal: React.FC<IAddWindowsServerLicenseProps> = (props) => {
  const windowsServerLicense = useAppSelector(windowsServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add License Scenario' : 'Edit License Scenario';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IWindowsServerLicense = {
    bu_id: null,
    company_id: null,
    opt_agreement_type: null,
    opt_exclude_non_prod: false,
    opt_default_to_data_center_on_hosts: false,
    notes: '',
    opt_entitlements: false,
    selected_date: moment(),
  };

  const onFinish = (values: IWindowsServerLicense) => {
    if (!isMultiple) {
      dispatch(saveWindowsServerLicense(values));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        values,
        windowsServerLicense.search.tableName
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
    form.setFieldsValue({ bu_id: buId });
  };

  const fillValuesOnEdit = async (data: IWindowsServerLicense) => {
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        opt_default_to_data_center_on_hosts: data.opt_default_to_data_center_on_hosts,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
        selected_date: _.isNull(data.selected_date) ? null : moment(data.selected_date),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (windowsServerLicense.save.messages.length > 0) {
      if (windowsServerLicense.save.hasErrors) {
        toast.error(windowsServerLicense.save.messages.join(' '));
      } else {
        toast.success(windowsServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearWindowsServerLicenseMessages());
    }
  }, [windowsServerLicense.save.messages]);

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
    if (+id > 0 && windowsServerLicense.getById.data) {
      const data = windowsServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [windowsServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    dispatch(getAgreementTypesLookup());
    if (+id > 0) {
      dispatch(getWindowsServerLicenseById(+id));
    }
    return () => {
      dispatch(clearWindowsServerLicenseGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isMultiple) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      if (globalSearch.company_id) {
        dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        dispatch(getBULookup(globalSearch.company_id[0]));
      }
      form.setFieldsValue(globalSearch);
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
        {windowsServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={windowsServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addWindowsServerLicense"
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
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_exclude_non_prod" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_exclude_non_prod']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OPT Exclude Non Prod</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Exclude Non Prod'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_data_center_on_hosts"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'opt_default_to_data_center_on_hosts']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OPT Default to DataCenter on Hosts</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Default to DataCenter on Hosts'
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
                      <Checkbox>OPT Entitlements</Checkbox>
                    </Form.Item>
                  ) : (
                    'OPT Entitlements'
                  )}
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
                loading={windowsServerLicense.save.loading || commonLookups.save.loading}
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
export default AddWindowsServerLicenseModal;
