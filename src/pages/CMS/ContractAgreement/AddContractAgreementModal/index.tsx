import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCmsContactLookup,
  getCmsPublisherLookup,
  getCmsTriggerTypeLookup,
  getCmsVectorLookup,
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
  clearCmsContractAgreementGetById,
  clearCmsContractAgreementMessages,
  cmsContractAgreementSelector,
} from '../../../../store/cms/contractAgreement/contractAgreement.reducer';
import { IAddCmsContractAgreementProps } from './addContractAgreement.model';
import { ICmsContractAgreement } from '../../../../services/cms/contractAgreement/contractAgreement.model';
import {
  getCmsContractAgreementById,
  saveCmsContractAgreement,
} from '../../../../store/cms/contractAgreement/contractAgreement.action';
import { ILookup } from '../../../../services/common/common.model';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  passDateToApi,
} from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const AddCmsContractAgreementModal: React.FC<IAddCmsContractAgreementProps> = (props) => {
  const cmsContractAgreement = useAppSelector(cmsContractAgreementSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsContractAgreement} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsContractAgreement = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    start_date: null,
    end_date: null,
    transaction_date: null,
    publisher_id: null,
    vendor_id: null,
    contract_number: '',
    contract_name: '',
    description: '',
    trigger_type_id: null,
    contractual_owner_contact_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsContractAgreement = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.start_date = passDateToApi(inputValues.start_date, true);
    inputValues.end_date = passDateToApi(inputValues.end_date, true);
    inputValues.transaction_date = passDateToApi(inputValues.transaction_date, true);
    if (!isMultiple) {
      dispatch(saveCmsContractAgreement(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsContractAgreement.search.tableName
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

  const fillValuesOnEdit = async (data: ICmsContractAgreement) => {
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
        start_date: _.isNull(data.start_date) ? null : forEditModal(data.start_date),
        end_date: _.isNull(data.end_date) ? null : forEditModal(data.end_date),
        transaction_date: _.isNull(data.transaction_date)
          ? null
          : forEditModal(data.transaction_date),
        publisher_id: _.isNull(data.publisher_id) ? null : data.publisher_id,
        vendor_id: _.isNull(data.vendor_id) ? null : data.vendor_id,
        contract_number: data.contract_number,
        contract_name: data.contract_name,
        description: data.description,
        trigger_type_id: _.isNull(data.trigger_type_id) ? null : data.trigger_type_id,
        contractual_owner_contact_id: _.isNull(data.contractual_owner_contact_id)
          ? null
          : data.contractual_owner_contact_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsContractAgreement.save.messages.length > 0) {
      if (cmsContractAgreement.save.hasErrors) {
        toast.error(cmsContractAgreement.save.messages.join(' '));
      } else {
        toast.success(cmsContractAgreement.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsContractAgreementMessages());
    }
  }, [cmsContractAgreement.save.messages]);

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
    if (+id > 0 && cmsContractAgreement.getById.data) {
      const data = cmsContractAgreement.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsContractAgreement.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmsContactLookup());
    dispatch(getCmsVectorLookup());
    dispatch(getCmsTriggerTypeLookup());
    dispatch(getCmsPublisherLookup());
    if (+id > 0) {
      dispatch(getCmsContractAgreementById(+id));
    }
    return () => {
      dispatch(clearCmsContractAgreementGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getCmsContractAgreementById(+id));
    }
    return () => {
      dispatch(clearCmsContractAgreementGetById());
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
      if (globalFilters.search.tenant_id && globalFilters.search.tenant_id !== 0) {
        if (!globalFilters.search.company_id) {
          dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        }
        if (!globalFilters.search.bu_id && globalFilters.search.company_id !== 0) {
          dispatch(getBULookup(globalSearch.company_id[0]));
        }
        const initlValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initlValues);
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
        {cmsContractAgreement.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsContractAgreement.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsContractAgreement"
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
                      loading={commonLookups.tenantLookup.loading}
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
                      {Object.keys(globalFilters?.globalTenantLookup?.data).length > 0
                        ? globalFilters?.globalTenantLookup?.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                      loading={commonLookups.companyLookup.loading}
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
                      {Object.keys(commonLookups.companyLookup.data).length > 0
                        ? commonLookups.companyLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalCompanyLookup?.data.map((option: ILookup) => (
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
                      loading={commonLookups.buLookup.loading}
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
                      name={['checked', 'contractual_owner_contact_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contractual Owner Contact</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contractual Owner Contact'
                  )}
                  <Form.Item
                    rules={[{ required: !isMultiple }]}
                    name="contractual_owner_contact_id"
                    className="m-0"
                    label="Contractual Owner Contact"
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsContactLookup.loading}
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
                      {commonLookups.cmsContactLookup.data.map((option: ILookup) => (
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
                      name={['checked', 'trigger_type_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Trigger Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Trigger Type'
                  )}
                  <Form.Item
                    name="trigger_type_id"
                    className="m-0"
                    label="Trigger Type"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsTriggerTypeLookup.loading}
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
                      {commonLookups.cmsTriggerTypeLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'vendor_id']} valuePropName="checked" noStyle>
                      <Checkbox>Vendor</Checkbox>
                    </Form.Item>
                  ) : (
                    'Vendor'
                  )}
                  <Form.Item name="vendor_id" className="m-0" label="Vendor ID">
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsVectorLookup.loading}
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
                      {commonLookups.cmsVectorLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'publisher_id']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher'
                  )}
                  <Form.Item
                    name="publisher_id"
                    className="m-0"
                    label="Publisher"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsPublisherLookup.loading}
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
                      {commonLookups.cmsPublisherLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'start_date']} valuePropName="checked" noStyle>
                      <Checkbox>Start Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Start Date'
                  )}
                  <Form.Item
                    name="start_date"
                    label="Start Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'end_date']} valuePropName="checked" noStyle>
                      <Checkbox>End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'End Date'
                  )}
                  <Form.Item name="end_date" label="End Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'transaction_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Transaction Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Transaction Date'
                  )}
                  <Form.Item
                    name="transaction_date"
                    label="Transaction Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'contract_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Contract Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Number'
                  )}
                  <Form.Item
                    name="contract_number"
                    label="Contract Number"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'contract_name']} valuePropName="checked" noStyle>
                      <Checkbox>Contract Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Contract Name'
                  )}
                  <Form.Item
                    name="contract_name"
                    label="Contract Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'description']} valuePropName="checked" noStyle>
                      <Checkbox>Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Description'
                  )}
                  <Form.Item name="description" label="Description" className="m-0">
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
                loading={cmsContractAgreement.save.loading || commonLookups.save.loading}
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
export default AddCmsContractAgreementModal;
