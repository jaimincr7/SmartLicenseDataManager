import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../../services/common/common.model';
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
import { IAddExcelFileMappingProps } from './addExcelFileMapping.model';
import {
  excelFileMappingSelector,
  clearExcelFileMappingGetById,
  clearExcelFileMappingMessages,
} from '../../../../store/master/excelFileMapping/excelFileMapping.reducer';
import {
  getExcelFileMappingById,
  saveExcelFileMapping,
} from '../../../../store/master/excelFileMapping/excelFileMapping.action';
import { IExcelFileMapping } from '../../../../services/master/excelFileMapping/excelFileMapping.model';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const AddExcelFileMappingModal: React.FC<IAddExcelFileMappingProps> = (props) => {
  const excelFileMapping = useAppSelector(excelFileMappingSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ExcelFileMapping} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IExcelFileMapping = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    key_word: '',
    is_public: false,
    created_by: null,
    file_type: '',
    delimiter: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IExcelFileMapping = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveExcelFileMapping(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        excelFileMapping.search.tableName
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

  const fillValuesOnEdit = async (data: IExcelFileMapping) => {
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
        key_word: data.key_word,
        is_public: false,
        created_by: null,
        file_type: data.file_type,
        delimiter: data.delimiter,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (excelFileMapping.save.messages.length > 0) {
      if (excelFileMapping.save.hasErrors) {
        toast.error(excelFileMapping.save.messages.join(' '));
      } else {
        toast.success(excelFileMapping.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearExcelFileMappingMessages());
    }
  }, [excelFileMapping.save.messages]);

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
    if (+id > 0 && excelFileMapping.getById.data) {
      const data = excelFileMapping.getById.data;
      fillValuesOnEdit(data);
    }
  }, [excelFileMapping.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getExcelFileMappingById(+id));
    }
    return () => {
      dispatch(clearExcelFileMappingGetById());
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
        {excelFileMapping.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={excelFileMapping.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addExcelFileMapping"
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
                  <Form.Item name="tenant_id" className="m-0" label="Tenant">
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
                    <Form.Item name={['checked', 'key_word']} valuePropName="checked" noStyle>
                      <Checkbox>Key Word</Checkbox>
                    </Form.Item>
                  ) : (
                    'Key Word'
                  )}
                  <Form.Item
                    name="key_word"
                    className="m-0"
                    label="Key Word"
                    rules={[{ required: !isMultiple, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'created_by']} valuePropName="checked" noStyle>
                      <Checkbox>Created By</Checkbox>
                    </Form.Item>
                  ) : (
                    'Created By'
                  )}
                  <Form.Item
                    name="created_by"
                    label="Created By"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'file_type']} valuePropName="checked" noStyle>
                      <Checkbox>File Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'File Type'
                  )}
                  <Form.Item
                    name="file_type"
                    label="File Type"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'delimiter']} valuePropName="checked" noStyle>
                      <Checkbox>Delimiter</Checkbox>
                    </Form.Item>
                  ) : (
                    'Delimiter'
                  )}
                  <Form.Item name="delimiter" label="Delimiter" className="m-0">
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_public" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_public']} valuePropName="checked" noStyle>
                      <Checkbox>Is Public</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Public'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={excelFileMapping.save.loading || commonLookups.save.loading}
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
export default AddExcelFileMappingModal;
