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
import { ICiscoProductAttributes } from '../../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.model';
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
  saveCiscoProductAttributes,
  getCiscoProductAttributesById,
} from '../../../../store/hwCisco/ciscoProductAttributes/ciscoProductAttributes.action';
import {
  ciscoProductAttributesSelector,
  clearCiscoProductAttributesMessages,
  clearCiscoProductAttributesGetById,
} from '../../../../store/hwCisco/ciscoProductAttributes/ciscoProductAttributes.reducer';
import { IAddCiscoProductAttributesProps } from './addCiscoProductAttributes.model';

const { Option } = Select;

const AddCiscoProductAttributesModal: React.FC<IAddCiscoProductAttributesProps> = (props) => {
  const ciscoProductAttributes = useAppSelector(ciscoProductAttributesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.HwCiscoProductAttributes} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoProductAttributes = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    source: '',
    product_id: null,
    product_description: '',
    l_do_sales: null,
    l_do_support: null,
    l_do_s_category: '',
    date_confirmed: null,
    date_source: '',
    asset_type: '',
    product_type: '',
    product_group: '',
    product_family: '',
    product_sub_type: '',
    generalized_type: '',
    software_analysis_category: '',
    architecture_group: '',
    architecture_sub_group: '',
    coverage_policy: '',
    no_coverage_reason: '',
    hardware_list_price: null,
    maintenance_list_price: null,
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoProductAttributes = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.l_do_sales = passDateToApi(inputValues.l_do_sales, true);
    inputValues.l_do_support = passDateToApi(inputValues.l_do_support, true);
    inputValues.date_confirmed = passDateToApi(inputValues.date_confirmed, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoProductAttributes(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoProductAttributes.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoProductAttributes) => {
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
        product_id: data.product_id,
        product_description: data.product_description,
        l_do_sales: _.isNull(data.l_do_sales) ? null : forEditModal(data.l_do_sales),
        l_do_support: _.isNull(data.l_do_support) ? null : forEditModal(data.l_do_support),
        l_do_s_category: data.l_do_s_category,
        date_confirmed: _.isNull(data.date_confirmed) ? null : forEditModal(data.date_confirmed),
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
        date_source: data.date_source,
        asset_type: data.asset_type,
        product_type: data.product_type,
        product_group: data.product_group,
        product_family: data.product_family,
        product_sub_type: data.product_sub_type,
        generalized_type: data.generalized_type,
        software_analysis_category: data.software_analysis_category,
        architecture_group: data.architecture_group,
        architecture_sub_group: data.architecture_sub_group,
        coverage_policy: data.coverage_policy,
        no_coverage_reason: data.no_coverage_reason,
        hardware_list_price: data.hardware_list_price,
        maintenance_list_price: data.maintenance_list_price,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoProductAttributes.save.messages.length > 0) {
      if (ciscoProductAttributes.save.hasErrors) {
        toast.error(ciscoProductAttributes.save.messages.join(' '));
      } else {
        toast.success(ciscoProductAttributes.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoProductAttributesMessages());
    }
  }, [ciscoProductAttributes.save.messages]);

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
    if (+id > 0 && ciscoProductAttributes.getById.data) {
      const data = ciscoProductAttributes.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoProductAttributes.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoProductAttributesById(+id));
    }
    return () => {
      dispatch(clearCiscoProductAttributesGetById());
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
        {ciscoProductAttributes.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoProductAttributes.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoProductAttributes"
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
                    <Form.Item name={['checked', 'product_id']} valuePropName="checked" noStyle>
                      <Checkbox>Product ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product ID'
                  )}
                  <Form.Item
                    name="product_id"
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 100, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_description']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Description'
                  )}
                  <Form.Item
                    name="product_description"
                    className="m-0"
                    label="Product Description"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'l_do_sales']} valuePropName="checked" noStyle>
                      <Checkbox>LDoSales</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDoSales'
                  )}
                  <Form.Item name="l_do_sales" label="LDoSales" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'l_do_support']} valuePropName="checked" noStyle>
                      <Checkbox>LDoSupport</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDoSupport'
                  )}
                  <Form.Item name="l_do_support" label="LDoSupport" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'l_do_s_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>LDoS Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'LDoS Category'
                  )}
                  <Form.Item
                    name="l_do_s_category"
                    className="m-0"
                    label="LDoS Category"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_confirmed']} valuePropName="checked" noStyle>
                      <Checkbox>Date_Confirmed</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date_Confirmed'
                  )}
                  <Form.Item name="date_confirmed" label="Date_Confirmed" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_source']} valuePropName="checked" noStyle>
                      <Checkbox>Date Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Source'
                  )}
                  <Form.Item
                    name="date_source"
                    label="Date Source"
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
                    <Form.Item name={['checked', 'asset_type']} valuePropName="checked" noStyle>
                      <Checkbox>Asset Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Asset Type'
                  )}
                  <Form.Item
                    name="asset_type"
                    label="Asset Type"
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
                    <Form.Item name={['checked', 'product_type']} valuePropName="checked" noStyle>
                      <Checkbox>Product Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Type'
                  )}
                  <Form.Item
                    name="product_type"
                    label="Product Type"
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
                    <Form.Item name={['checked', 'product_group']} valuePropName="checked" noStyle>
                      <Checkbox>Product Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Group'
                  )}
                  <Form.Item
                    name="product_group"
                    label="Product Group"
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
                    <Form.Item name={['checked', 'product_family']} valuePropName="checked" noStyle>
                      <Checkbox>Product Family</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Family'
                  )}
                  <Form.Item
                    name="product_family"
                    label="Product Family"
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
                      name={['checked', 'product_sub_type']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product SubType</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product SubType'
                  )}
                  <Form.Item
                    name="product_sub_type"
                    label="Product SubType"
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
                      name={['checked', 'generalized_type']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Generalized Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Generalized Type'
                  )}
                  <Form.Item
                    name="generalized_type"
                    label="Generalized Type"
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
                      name={['checked', 'software_analysis_category']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Software Analysis Category</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software Analysis Category'
                  )}
                  <Form.Item
                    name="software_analysis_category"
                    label="Software Analysis Category"
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
                      name={['checked', 'architecture_group']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Architecture Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'Architecture Group'
                  )}
                  <Form.Item
                    name="architecture_group"
                    label="Architecture Group"
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
                      name={['checked', 'architecture_sub_group']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Architecture SubGroup</Checkbox>
                    </Form.Item>
                  ) : (
                    'Architecture SubGroup'
                  )}
                  <Form.Item
                    name="architecture_sub_group"
                    label="Architecture SubGroup"
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
                      name={['checked', 'coverage_policy']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Coverage Policy</Checkbox>
                    </Form.Item>
                  ) : (
                    'Coverage Policy'
                  )}
                  <Form.Item
                    name="coverage_policy"
                    label="Coverage Policy"
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
                      name={['checked', 'no_coverage_reason']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>No Coverage Reason</Checkbox>
                    </Form.Item>
                  ) : (
                    'No Coverage Reason'
                  )}
                  <Form.Item
                    name="no_coverage_reason"
                    label="No Coverage Reason"
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
                      name={['checked', 'hardware_list_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hardware List Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hardware List Price'
                  )}
                  <Form.Item
                    name="hardware_list_price"
                    label="Hardware List Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'maintenance_list_price']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Maintenance List Price</Checkbox>
                    </Form.Item>
                  ) : (
                    'Maintenance List Price'
                  )}
                  <Form.Item
                    name="maintenance_list_price"
                    label="Maintenance List Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoProductAttributes.save.loading || commonLookups.save.loading}
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
export default AddCiscoProductAttributesModal;
