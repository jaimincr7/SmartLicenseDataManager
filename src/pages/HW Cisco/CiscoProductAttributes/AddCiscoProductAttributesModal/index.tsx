import {
  Button,
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
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoProductAttributes } from '../../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoProductAttributes = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCiscoProductAttributes(inputValues));
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
        l_do_sales: _.isNull(data.l_do_sales) ? null : moment(data.l_do_sales),
        l_do_support: _.isNull(data.l_do_support) ? null : moment(data.l_do_support),
        l_do_s_category: data.l_do_s_category,
        date_confirmed: _.isNull(data.date_confirmed) ? null : moment(data.date_confirmed),
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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
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
                  <label className="label">Company</label>
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
                  <label className="label">BU</label>
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
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product ID</label>
                  <Form.Item
                    name="product_id"
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 100, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Description</label>
                  <Form.Item
                    name="product_description"
                    className="m-0"
                    label="Product_Description"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">LDo Sales</label>
                  <Form.Item name="l_do_sales" label="LDoSales" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">LDo Support</label>
                  <Form.Item name="l_do_support" label="LDoSupport" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">LDoS Category</label>
                  <Form.Item
                    name="l_do_s_category"
                    className="m-0"
                    label="LDoS_Category"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Date Confirmed</label>
                  <Form.Item name="date_confirmed" label="Date_Confirmed" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Date Source</label>
                  <Form.Item
                    name="date_source"
                    label="Date_Source"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Asset Type</label>
                  <Form.Item
                    name="asset_type"
                    label="Asset_Type"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Type</label>
                  <Form.Item
                    name="product_type"
                    label="Product_Type"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Group</label>
                  <Form.Item
                    name="product_group"
                    label="Product_Group"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Family</label>
                  <Form.Item
                    name="product_family"
                    label="Product_Family"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Sub Type</label>
                  <Form.Item
                    name="product_sub_type"
                    label="Product_SubType"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Generalized Type</label>
                  <Form.Item
                    name="generalized_type"
                    label="Generalized_Type"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Software Analysis Category</label>
                  <Form.Item
                    name="software_analysis_category"
                    label="Software_Analysis_Category"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Architecture Group</label>
                  <Form.Item
                    name="architecture_group"
                    label="Architecture_Group"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Architecture Sub Group</label>
                  <Form.Item
                    name="architecture_sub_group"
                    label="Architecture_SubGroup"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Coverage Policy</label>
                  <Form.Item
                    name="coverage_policy"
                    label="Coverage_Policy"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">No Coverage Reason</label>
                  <Form.Item
                    name="no_coverage_reason"
                    label="No_Coverage_Reason"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hardware List Price</label>
                  <Form.Item
                    name="hardware_list_price"
                    label="Hardware_List_Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Maintenance List Price</label>
                  <Form.Item
                    name="maintenance_list_price"
                    label="Maintenance_List_Price"
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
                loading={ciscoProductAttributes.save.loading}
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
