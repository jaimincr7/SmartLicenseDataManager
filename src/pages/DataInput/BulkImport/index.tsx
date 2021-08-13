import { Button, Checkbox, Col, DatePicker, Form, Popover, Row, Select, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  bulkInsert,
  getTables,
  getExcelColumns,
  getTableColumns,
  getTablesForImport,
  saveTableForImport,
} from '../../../store/bulkImport/bulkImport.action';
import {
  clearExcelColumns,
  clearBulkImportMessages,
  bulkImportSelector,
  clearGetTableColumns,
  setTableForImport,
} from '../../../store/bulkImport/bulkImport.reducer';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  IBulkInsertDataset,
  IDatabaseTable,
  IExcelSheetColumn,
  ILookup,
} from '../../../services/common/common.model';
import { validateMessages } from '../../../common/constants/common';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { SettingOutlined } from '@ant-design/icons';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../store/common/common.reducer';
import {
  getCompanyLookup,
  getBULookup,
  getTenantLookup,
} from '../../../store/common/common.action';
import moment from 'moment';

const { Option } = Select;

const BulkImport: React.FC = () => {
  const bulkImports = useAppSelector(bulkImportSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form] = Form.useForm();
  const [formUpload] = Form.useForm();

  const [defaultFile, setDefaultFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState(null);
  const [removedColumns, setRemovedColumns] = useState(null);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const { table } = useParams<{ table: string }>();

  const uploadFile = async (options) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append('file', file);

    try {
      dispatch(getExcelColumns(file));
      onSuccess('Ok');
    } catch (err) {
      onError({ err });
    }
  };

  const handleTableChange = (table: string) => {
    if (table) {
      dispatch(getTableColumns(table));
    } else {
      dispatch(clearGetTableColumns());
    }
  };

  const handleSheetChange = () => {
    setFormFields();
  };

  const handleOnChange = ({ file }) => {
    if (file.status === 'removed') {
      dispatch(clearExcelColumns());
      setDefaultFile(null);
      setExcelColumns(null);
      setTableColumns(null);
      formUpload.setFieldsValue({ sheet_name: '' });
    } else if (file.status === 'done') {
      setDefaultFile(file);
    }
  };

  const onFinish = (values: any) => {
    const { tenant_id, company_id, bu_id, date_added, ...rest } = values;

    const sqlToExcelMapping = [];
    Object.entries(rest).forEach(([key, value]) => {
      if (key && value) {
        sqlToExcelMapping.push({
          key: `${key}`,
          value: `${value}`,
        });
      }
    });

    if (sqlToExcelMapping.length === 0) {
      return false;
    }
    const uploadValue = formUpload.getFieldsValue();
    const inputValues: IBulkInsertDataset = {
      excel_to_sql_mapping: sqlToExcelMapping,
      file_name: bulkImports.getExcelColumns.data.filename,
      table_name: uploadValue?.table_name,
      sheet_name: uploadValue?.sheet_name,
      foreign_key_values: {
        tenant_id: tenant_id,
        bu_id: bu_id,
        company_id: company_id,
        date_added: date_added,
      },
    };
    dispatch(bulkInsert(inputValues));
  };

  const setFormFields = async () => {
    let currentSheetName = formUpload.getFieldValue('sheet_name');
    if (!currentSheetName && bulkImports.getExcelColumns.data?.excel_sheet_columns) {
      currentSheetName = bulkImports.getExcelColumns.data.excel_sheet_columns[0].sheet;
      formUpload.setFieldsValue({ sheet_name: currentSheetName });
    }
    if (bulkImports.getTableColumns.data && bulkImports.getExcelColumns.data?.excel_sheet_columns) {
      const columnsArray = ['TenantId', 'CompanyId', 'BU_Id', 'Date Added'];
      const filterExcelColumns = bulkImports.getExcelColumns.data.excel_sheet_columns.find(
        (e) => e.sheet === currentSheetName
      ).columns;
      const filterTableColumns = bulkImports.getTableColumns.data.filter(
        (x) => !columnsArray.includes(x.name)
      );
      const removedColumns = bulkImports.getTableColumns.data.filter((x) =>
        columnsArray.includes(x.name)
      );

      setExcelColumns(filterExcelColumns);
      setTableColumns(filterTableColumns);
      setRemovedColumns(removedColumns);

      removedColumns.some((x) => x.name === 'TenantId') && dispatch(getTenantLookup());

      const initialValuesData: any = {
        tenant_id: null,
        bu_id: null,
        company_id: null,
        date_added: moment(),
      };
      filterTableColumns.map(function (ele) {
        initialValuesData[ele.name] =
          filterExcelColumns.filter(
            (x) =>
              x.toLowerCase()?.replace(/\s/g, '') === ele.name.toLowerCase()?.replace(/\s/g, '')
          ).length > 0
            ? filterExcelColumns.filter(
                (x) =>
                  x.toLowerCase()?.replace(/\s/g, '') === ele.name.toLowerCase()?.replace(/\s/g, '')
              )[0]
            : '';
      });
      form.setFieldsValue(initialValuesData);
    } else {
      form.setFieldsValue({});
      setExcelColumns(null);
      setTableColumns(null);
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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  const resetPage = () => {
    dispatch(clearGetTableColumns());
    dispatch(clearExcelColumns());
    formUpload.resetFields(['upload_file', 'sheet_name']);
    setDefaultFile(null);
    setExcelColumns(null);
    setTableColumns(null);
  };

  useEffect(() => {
    if (bulkImports.bulkInsert.messages.length > 0) {
      if (bulkImports.bulkInsert.hasErrors) {
        toast.error(bulkImports.bulkInsert.messages.join(' '));
      } else {
        toast.success(bulkImports.bulkInsert.messages.join(' '));
        if (table) {
          history.goBack();
        }
      }
      dispatch(clearBulkImportMessages());
    }
  }, [bulkImports.bulkInsert.messages]);

  useEffect(() => {
    setFormFields();
  }, [bulkImports.getTableColumns.data, bulkImports.getExcelColumns.data?.excel_sheet_columns]);

  useEffect(() => {
    if (!(bulkImports.getTables.data && bulkImports.getTables.data.length > 0)) {
      dispatch(getTables());
    }
    if (!table) {
      dispatch(getTablesForImport());
      handleIndeterminate();
    }
    return () => {
      dispatch(clearExcelColumns());
    };
  }, [dispatch]);

  useEffect(() => {
    if (table) {
      const currentTable = bulkImports.getTables.data.filter(
        (t) => t.name.toLowerCase() === (table || '').toLowerCase()
      );
      if (currentTable.length > 0) {
        formUpload.setFieldsValue({ table_name: currentTable[0].name });
        dispatch(getTableColumns(currentTable[0].name));
      }
    }
  }, [bulkImports.getTables.data]);

  // Start: Set tables for import
  useEffect(() => {
    if (bulkImports.saveTableForImport.messages.length > 0) {
      if (bulkImports.saveTableForImport.hasErrors) {
        toast.error(bulkImports.saveTableForImport.messages.join(' '));
      } else {
        toast.success(bulkImports.saveTableForImport.messages.join(' '));
        dispatch(getTables());
      }
      dispatch(clearBulkImportMessages());
    }
  }, [bulkImports.saveTableForImport.messages]);

  useEffect(() => {
    handleIndeterminate();
  }, [bulkImports.getTablesForImport.data]);

  const handleCheckChange = (e, tableName) => {
    dispatch(
      setTableForImport(
        bulkImports.getTablesForImport.data.map((table) =>
          table.name === tableName ? { ...table, is_available: e.target.checked } : table
        )
      )
    );
    handleIndeterminate();
  };

  const handleIndeterminate = () => {
    const selectedTables = bulkImports.getTablesForImport.data.filter(
      (table) => table.is_available
    );
    setIndeterminate(
      !!selectedTables.length && selectedTables.length < bulkImports.getTablesForImport.data.length
    );
    setCheckAll(selectedTables.length === bulkImports.getTablesForImport.data.length);
  };

  const handleSelectAllChange = (e) => {
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    dispatch(
      setTableForImport(
        bulkImports.getTablesForImport.data.map((item) => ({
          name: item.name,
          is_available: e.target.checked,
        }))
      )
    );
  };

  const saveTables = () => {
    const selectedTables = bulkImports.getTablesForImport.data
      .filter((table) => table.is_available)
      .map((table) => table.name);
    if (selectedTables.length > 0) {
      const inputValues = {
        table_names: selectedTables,
      };
      dispatch(saveTableForImport(inputValues));
    } else {
      toast.info('Please select some tables.');
      return false;
    }
  };

  const dropdownMenu = (
    <div className="checkbox-list-wrapper">
      <ul className="checkbox-list">
        <li className="line-bottom">
          <Checkbox
            className="strong"
            checked={checkAll}
            onClick={handleSelectAllChange}
            indeterminate={indeterminate}
          >
            Select All
          </Checkbox>
        </li>
        {bulkImports.getTablesForImport.data?.map((table) => (
          <li key={table.name}>
            <Checkbox
              checked={table.is_available}
              onClick={(e) => handleCheckChange(e, table.name)}
            >
              {table.name}
            </Checkbox>
          </li>
        ))}
      </ul>
      <div className="bottom-fix">
        <Button
          type="primary"
          className="w-100"
          loading={bulkImports.saveTableForImport.loading}
          onClick={saveTables}
        >
          Save
        </Button>
      </div>
    </div>
  );
  // End: set tables for import

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
          <h4 className="p-0">
            <BreadCrumbs pageName={Page.BulkImport} />
          </h4>
          <div className="btns-block">
            {table ? (
              <Button
                className="btn-icon"
                type="primary"
                onClick={() => history.goBack()}
                icon={
                  <em className="anticon">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/ic-left-arrow.svg`} alt="" />
                  </em>
                }
              >
                Back
              </Button>
            ) : (
              <Popover content={dropdownMenu} trigger="click" overlayClassName="custom-popover">
                <Button
                  icon={<SettingOutlined />}
                  loading={bulkImports.getTablesForImport.loading}
                ></Button>
              </Popover>
            )}
          </div>
        </div>
        <div className="main-card">
          <div className="input-btns-title">
            <Form form={formUpload} name="formUpload">
              <Row gutter={[30, 20]} className="align-item-start">
                <Col xs={24} md={8}>
                  <label className="label w-100">Upload Excel</label>
                  <Form.Item name={'upload_file'} className="m-0">
                    <div className="upload-file">
                      <Upload
                        accept=".xls,.xlsx"
                        customRequest={uploadFile}
                        onChange={handleOnChange}
                        defaultFileList={defaultFile}
                        maxCount={1}
                        showUploadList={{
                          showRemoveIcon: true,
                          removeIcon: (
                            <img
                              src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`}
                              alt=""
                            />
                          ),
                        }}
                      >
                        <Button
                          type="primary"
                          className="btn-icon"
                          icon={
                            <em className="anticon">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/ic-upload.svg`}
                                alt=""
                              />
                            </em>
                          }
                        >
                          Choose File
                        </Button>
                      </Upload>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Table Name</label>
                    <Form.Item name={'table_name'} className="m-0">
                      <Select
                        // suffixIcon={!bulkImports.getTables.loading &&
                        //   (<img
                        //     src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                        //     alt=""
                        //   />)
                        // }
                        onChange={handleTableChange}
                        loading={bulkImports.getTables.loading}
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
                        {bulkImports.getTables.data?.map(
                          (option: IDatabaseTable, index: number) => (
                            <Option key={index} value={option.name}>
                              {option.name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                {bulkImports.getExcelColumns.data?.excel_sheet_columns && (
                  <Col xs={24} md={8}>
                    <div className="form-group m-0">
                      <label className="label">Sheet Name</label>
                      <Form.Item name={'sheet_name'} className="m-0">
                        <Select
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
                          suffixIcon={
                            <img
                              src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                              alt=""
                            />
                          }
                          onChange={handleSheetChange}
                          loading={false}
                        >
                          {bulkImports.getExcelColumns.data?.excel_sheet_columns.map(
                            (option: IExcelSheetColumn, index: number) => (
                              <Option key={index} value={option.sheet}>
                                {option.sheet}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                )}
              </Row>
            </Form>
          </div>
          {(bulkImports.getExcelColumns.loading || bulkImports.getTableColumns.loading) && (
            <div className="spin-loader">
              <Spin spinning={true} />
            </div>
          )}
          <Form
            form={form}
            name="uploadExcelSheet"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            {!bulkImports.getExcelColumns.loading &&
              !bulkImports.getTableColumns.loading &&
              tableColumns &&
              tableColumns.length > 0 &&
              excelColumns && (
                <>
                  {removedColumns && removedColumns.length > 0 && (
                    <Row gutter={[30, 0]} className="form-label-hide input-btns-title">
                      {removedColumns.some((x) => x.name === 'TenantId') && (
                        <Col xs={24} sm={12} md={8}>
                          <div className="form-group m-0">
                            <label className="label">Tenant</label>
                            <Form.Item
                              name="tenant_id"
                              className="m-0"
                              label="Tenant"
                              rules={[
                                {
                                  required:
                                    bulkImports.getTableColumns.data.find(
                                      (x) => x.name === 'TenantId'
                                    )?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
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
                                {commonLookups.tenantLookup.data.map((option: ILookup) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                      {removedColumns.some((x) => x.name === 'CompanyId') && (
                        <Col xs={24} sm={12} md={8}>
                          <div className="form-group m-0">
                            <label className="label">Company</label>
                            <Form.Item
                              name="company_id"
                              className="m-0"
                              label="Company"
                              rules={[
                                {
                                  required:
                                    bulkImports.getTableColumns.data.find(
                                      (x) => x.name === 'CompanyId'
                                    )?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
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
                                {commonLookups.companyLookup.data.map((option: ILookup) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                      {removedColumns.some((x) => x.name === 'BU_Id') && (
                        <Col xs={24} sm={12} md={8}>
                          <div className="form-group m-0">
                            <label className="label">BU</label>
                            <Form.Item
                              name="bu_id"
                              className="m-0"
                              label="BU"
                              rules={[
                                {
                                  required:
                                    bulkImports.getTableColumns.data.find((x) => x.name === 'BU_Id')
                                      ?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
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
                                {commonLookups.buLookup.data.map((option: ILookup) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                      {removedColumns.some((x) => x.name === 'Date Added') && (
                        <Col xs={24} sm={12} md={8}>
                          <div className="form-group m-0">
                            <label className="label">Date Added</label>
                            <Form.Item
                              name="date_added"
                              label="Date Added"
                              className="m-0"
                              rules={[
                                {
                                  required:
                                    bulkImports.getTableColumns.data.find(
                                      (x) => x.name === 'Date Added'
                                    )?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
                            >
                              <DatePicker className="w-100" disabledDate={disabledDate} />
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                  <Row gutter={[30, 0]} className="form-label-hide">
                    <Col xs={24} md={12} lg={12} xl={8}>
                      <div className="form-group form-inline">
                        <label className="label strong">Database Column</label>
                        <label className="strong">Excel Column</label>
                      </div>
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={8} className="sm-none">
                      <div className="form-group form-inline">
                        <label className="label strong">Database Column</label>
                        <label className="strong">Excel Column</label>
                      </div>
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={8} className="lg-none">
                      <div className="form-group form-inline">
                        <label className="label strong">Database Column</label>
                        <label className="strong">Excel Column</label>
                      </div>
                    </Col>
                    {tableColumns.map((col, index: number) => (
                      <Col xs={24} md={12} lg={12} xl={8} key={index}>
                        <div className="form-group form-inline">
                          <label className="label">{col.name}</label>
                          <Form.Item
                            name={col.name}
                            className="m-0 w-100"
                            label={col.name}
                            rules={[{ required: col.is_nullable === 'NO' ? true : false }]}
                          >
                            <Select
                              showSearch
                              allowClear
                              suffixIcon={
                                <img
                                  src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                                  alt=""
                                />
                              }
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
                              {excelColumns.map((option: string, index: number) => (
                                <Option key={index} value={option}>
                                  {option}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="btns-block">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={bulkImports.bulkInsert.loading}
                    >
                      Save
                    </Button>
                    <Button onClick={() => resetPage()}>Cancel</Button>
                  </div>
                </>
              )}
          </Form>
        </div>
      </div>
    </>
  );
};
export default BulkImport;
