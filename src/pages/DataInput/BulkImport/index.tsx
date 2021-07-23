import { Button, Col, Form, Row, Select, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  bulkInsert,
  getDatabaseTables,
  getExcelColumns,
  getTableColumns,
} from '../../../store/bulkImport/bulkImport.action';
import {
  clearExcelColumns,
  clearBulkImportMessages,
  bulkImportSelector,
  clearGetTableColumns,
} from '../../../store/bulkImport/bulkImport.reducer';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  IBulkInsertDataset,
  IDatabaseTable,
  IExcelSheetColumn,
} from '../../../services/common/common.model';
import { validateMessages } from '../../../common/constants/common';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const { Option } = Select;

const BulkImport: React.FC = () => {
  const bulkImports = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form] = Form.useForm();
  const [formUpload] = Form.useForm();

  const [defaultFile, setDefaultFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState(null);

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
    const sqlToExcelMapping = [];
    Object.entries(values).forEach(([key, value]) => {
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
      const filterExcelColumns = bulkImports.getExcelColumns.data.excel_sheet_columns.find(
        (e) => e.sheet === currentSheetName
      ).columns;
      setExcelColumns(filterExcelColumns);
      setTableColumns(bulkImports.getTableColumns.data);

      const initialValuesData: any = {};
      bulkImports.getTableColumns.data.map(function (ele) {
        initialValuesData[ele.name] = filterExcelColumns.includes(ele.name) ? ele.name : '';
      });
      form.setFieldsValue(initialValuesData);
    } else {
      form.setFieldsValue({});
      setExcelColumns(null);
      setTableColumns(null);
    }
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
        resetPage();
      }
      dispatch(clearBulkImportMessages());
    }
  }, [bulkImports.bulkInsert.messages]);

  useEffect(() => {
    setFormFields();
  }, [bulkImports.getTableColumns.data, bulkImports.getExcelColumns.data?.excel_sheet_columns]);

  useEffect(() => {
    if (!(bulkImports.getDatabaseTables.data && bulkImports.getDatabaseTables.data.length > 0)) {
      dispatch(getDatabaseTables());
    }
    return () => {
      dispatch(clearExcelColumns());
    };
  }, [dispatch]);

  useEffect(() => {
    if (table) {
      const currentTable = bulkImports.getDatabaseTables.data.filter(
        (t) => t.name.toLowerCase() === (table || '').toLowerCase()
      );
      if (currentTable.length > 0) {
        formUpload.setFieldsValue({ table_name: currentTable[0].name });
        dispatch(getTableColumns(currentTable[0].name));
      }
    }
  }, [bulkImports.getDatabaseTables.data]);

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
        <BreadCrumbs pageName={Page.BulkImport}></BreadCrumbs>
          <div className="btns-block">
            {table && (
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
                        showSearch
                        // suffixIcon={!bulkImports.getDatabaseTables.loading &&
                        //   (<img
                        //     src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                        //     alt=""
                        //   />)
                        // }
                        onChange={handleTableChange}
                        loading={bulkImports.getDatabaseTables.loading}
                      >
                        {bulkImports.getDatabaseTables.data?.map(
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
