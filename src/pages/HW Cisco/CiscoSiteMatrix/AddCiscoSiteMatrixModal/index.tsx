import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoSiteMatrix } from '../../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.model';
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
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import {
  saveCiscoSiteMatrix,
  getCiscoSiteMatrixById,
} from '../../../../store/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.action';
import {
  ciscoSiteMatrixSelector,
  clearCiscoSiteMatrixMessages,
  clearCiscoSiteMatrixGetById,
} from '../../../../store/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.reducer';
import { IAddCiscoSiteMatrixProps } from './addCiscoSiteMatrix.model';

const { Option } = Select;

const AddCiscoSiteMatrixModal: React.FC<IAddCiscoSiteMatrixProps> = (props) => {
  const ciscoSiteMatrix = useAppSelector(ciscoSiteMatrixSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoSiteMatrix} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoSiteMatrix = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    source: '',
    installed_at_site_id: '',
    historical_shipped_instance_count: 0,
    installed_at_site_status: '',
    installed_at_customer_name: '',
    installed_at_address_line: '',
    installed_at_city: '',
    installed_at_country: '',
    installed_at_postal_code: '',
    installed_at_state_province: '',
    installed_at_cr_party_id: '',
    installed_at_cr_party_name: '',
    installed_at_gu_id: '',
    installed_at_gu_name: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoSiteMatrix = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoSiteMatrix(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoSiteMatrix.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoSiteMatrix) => {
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
        source: data.source,
        installed_at_site_id: data.installed_at_site_id,
        historical_shipped_instance_count: data.historical_shipped_instance_count,
        installed_at_site_status: data.installed_at_site_status,
        installed_at_customer_name: data.installed_at_customer_name,
        installed_at_address_line: data.installed_at_address_line,
        installed_at_city: data.installed_at_city,
        installed_at_country: data.installed_at_country,
        installed_at_postal_code: data.installed_at_postal_code,
        installed_at_state_province: data.installed_at_state_province,
        installed_at_cr_party_id: data.installed_at_cr_party_id,
        installed_at_cr_party_name: data.installed_at_cr_party_name,
        installed_at_gu_id: data.installed_at_gu_id,
        installed_at_gu_name: data.installed_at_gu_name,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoSiteMatrix.save.messages.length > 0) {
      if (ciscoSiteMatrix.save.hasErrors) {
        toast.error(ciscoSiteMatrix.save.messages.join(' '));
      } else {
        toast.success(ciscoSiteMatrix.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoSiteMatrixMessages());
    }
  }, [ciscoSiteMatrix.save.messages]);

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
    if (+id > 0 && ciscoSiteMatrix.getById.data) {
      const data = ciscoSiteMatrix.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoSiteMatrix.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoSiteMatrixById(+id));
    }
    return () => {
      dispatch(clearCiscoSiteMatrixGetById());
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
        const initialValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initialValues);
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
        {ciscoSiteMatrix.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoSiteMatrix.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoSiteMatrix"
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
                    <Form.Item name={['checked', 'source']} valuePropName="checked" noStyle>
                      <Checkbox>Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Source'
                  )}
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_site_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Site Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Site Id'
                  )}
                  <Form.Item
                    name="installed_at_site_id"
                    className="m-0"
                    label="Installed At Site Id"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'historical_shipped_instance_count']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Historical Shipped Instance Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Historical Shipped Instance Count'
                  )}
                  <Form.Item
                    name="historical_shipped_instance_count"
                    className="m-0"
                    label="Historical Shipped Instance Count"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_added']} valuePropName="checked" noStyle>
                      <Checkbox>Date Added</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Added'
                  )}
                  <Form.Item name="date_added" label="Date Added" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_site_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Site Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Site Status'
                  )}
                  <Form.Item
                    name="installed_at_site_status"
                    className="m-0"
                    label="Installed At Site Status"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_customer_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Customer Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Customer Name'
                  )}
                  <Form.Item
                    name="installed_at_customer_name"
                    className="m-0"
                    label="Installed At Customer Name"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_address_line']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Address Line</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Address Line'
                  )}
                  <Form.Item
                    name="installed_at_address_line"
                    className="m-0"
                    label="Installed At Address Line"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_city']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At City</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At City'
                  )}
                  <Form.Item
                    name="installed_at_city"
                    label="Installed At City"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_country']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Country</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Country'
                  )}
                  <Form.Item
                    name="installed_at_country"
                    label="Installed At Country"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_postal_code']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Postal Code'
                  )}
                  <Form.Item
                    name="installed_at_postal_code"
                    label="Installed At Postal Code"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_state_province']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At State Province</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At State Province'
                  )}
                  <Form.Item
                    name="installed_at_state_province"
                    label="Installed At State Province"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_cr_party_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Cr Party Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Cr Party Id'
                  )}
                  <Form.Item
                    name="installed_at_cr_party_id"
                    label="Installed At Cr Party Id"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_cr_party_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Cr Party Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Cr Party Name'
                  )}
                  <Form.Item
                    name="installed_at_cr_party_name"
                    label="Installed At Cr Party Name"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_gu_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Gu Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Gu Id'
                  )}
                  <Form.Item
                    name="installed_at_gu_id"
                    label="Installed At Gu Id"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'installed_at_gu_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Installed At Gu Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed At Gu Name'
                  )}
                  <Form.Item
                    name="installed_at_gu_name"
                    label="Installed At Gu Name"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoSiteMatrix.save.loading || commonLookups.save.loading}
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
export default AddCiscoSiteMatrixModal;
