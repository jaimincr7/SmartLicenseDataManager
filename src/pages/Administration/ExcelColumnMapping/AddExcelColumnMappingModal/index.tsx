import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
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
import { IAddExcelColumnMappingProps } from './addExcelColumnMapping.model';
import {
  excelColumnMappingSelector,
  clearExcelColumnMappingGetById,
  clearExcelColumnMappingMessages,
} from '../../../../store/master/excelColumnMapping/excelColumnMapping.reducer';
import {
  getExcelColumnMappingById,
  saveExcelColumnMapping,
} from '../../../../store/master/excelColumnMapping/excelColumnMapping.action';
import { IExcelColumnMapping } from '../../../../services/master/excelColumnMapping/excelColumnMapping.model';
import { validateMessages } from '../../../../common/constants/common';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const AddExcelColumnMappingModal: React.FC<IAddExcelColumnMappingProps> = (props) => {
  const excelColumnMapping = useAppSelector(excelColumnMappingSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ExcelColumnMapping} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IExcelColumnMapping = {
    excel_file_mapping_id: null,
    sheet_name: '',
    header_row: null,
    mapping: '',
    table_name: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IExcelColumnMapping = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveExcelColumnMapping(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        excelColumnMapping.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IExcelColumnMapping) => {
    if (data) {
      initialValues = {
        excel_file_mapping_id: _.isNull(data.excel_file_mapping_id)
          ? null
          : data.excel_file_mapping_id,
        sheet_name: data.sheet_name,
        header_row: _.isNull(data.header_row) ? null : data.header_row,
        mapping: data.mapping,
        table_name: data.table_name,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (excelColumnMapping.save.messages.length > 0) {
      if (excelColumnMapping.save.hasErrors) {
        toast.error(excelColumnMapping.save.messages.join(' '));
      } else {
        toast.success(excelColumnMapping.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearExcelColumnMappingMessages());
    }
  }, [excelColumnMapping.save.messages]);

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
    if (+id > 0 && excelColumnMapping.getById.data) {
      const data = excelColumnMapping.getById.data;
      fillValuesOnEdit(data);
    }
  }, [excelColumnMapping.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getExcelColumnMappingById(+id));
    }
    return () => {
      dispatch(clearExcelColumnMappingGetById());
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
        {excelColumnMapping.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={excelColumnMapping.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addExcelColumnMapping"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'excel_file_mapping_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Excel File Mapping Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Excel File Mapping Id'
                  )}
                  <Form.Item
                    name="excel_file_mapping_id"
                    className="m-0"
                    label="Excel File Mapping Id"
                    rules={[{ required: !isMultiple, type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'sheet_name']} valuePropName="checked" noStyle>
                      <Checkbox>Sheet Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Sheet Name'
                  )}
                  <Form.Item
                    name="sheet_name"
                    label="Sheet Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'integer' }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'header_row']} valuePropName="checked" noStyle>
                      <Checkbox>Header Row</Checkbox>
                    </Form.Item>
                  ) : (
                    'Header Row'
                  )}
                  <Form.Item
                    name="header_row"
                    label="Header Row"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'integer' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'mapping']} valuePropName="checked" noStyle>
                      <Checkbox>Mapping</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mapping'
                  )}
                  <Form.Item
                    name="mapping"
                    label="Mapping"
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
                    <Form.Item name={['checked', 'table_name']} valuePropName="checked" noStyle>
                      <Checkbox>Table Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Table Name'
                  )}
                  <Form.Item
                    name="table_name"
                    label="Table Name"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Input min={0} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={excelColumnMapping.save.loading || commonLookups.save.loading}
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
export default AddExcelColumnMappingModal;
