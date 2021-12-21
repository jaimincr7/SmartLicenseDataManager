import { Button, Checkbox, Col, DatePicker, Form, Popover, Row, Select, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { Page } from '../../../common/constants/pageAction';
import _ from 'lodash';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  bulkImportSelector,
  clearBulkImport,
  clearBulkImportMessages,
  clearExcelColumns,
  clearGetTableColumns,
  setTableForImport,
} from '../../../store/bulkImport/bulkImport.reducer';
import { useEffect, useState } from 'react';
import {
  getExcelColumns,
  getTables,
  getTablesForImport,
  saveTableForImport,
} from '../../../store/bulkImport/bulkImport.action';
import { toast } from 'react-toastify';
import Dragger from 'antd/lib/upload/Dragger';
import { IDatabaseTable } from '../../../services/common/common.model';
import { UploadFile } from 'antd/lib/upload/interface';
import RenderBI from '../RenderBI';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import moment from 'moment';
import { Common } from '../../../common/constants/common';
import CkeckDelimiterModal from '../CheckDelimiter';

const { Option } = Select;
let getFileMappingTimeOut = null;
let currentIndex = 1;

const BulkImport: React.FC = () => {
  const globalLookups = useAppSelector(globalSearchSelector);
  const bulkImports = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [formUpload] = Form.useForm();
  const [form] = Form.useForm();

  let { table } = useParams<{ table: string }>();
  table && (table = decodeURIComponent(table));
  const [count, setCount] = useState({ save: 0, reset: 0 });
  const [tableName, setTableName] = useState<string>(table);
  //const [defaultFile, setDefaultFile] = useState(null);
  //const [excelColumnState, setExcelColumnState] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([]);
  const [records, setRecords] = useState<
    Array<{
      index: number;
      filename: string;
      excel_to_sql_mapping: any;
      show_mapping: any;
      original_filename: string;
      table_name: string;
      header_row: number;
      sheet: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [delimitModalShow, setDelimitModalShow] = useState(false);
  const [delimitFlag, setDelimitFlag] = useState(true);

  const [date, setDate] = useState(null);

  const formUploadInitialValues = {
    header_row: 1,
    table_name: table,
  };

  const uploadFile = async (options) => {
    const { onSuccess, file } = options;
    const formData = new FormData();
    formData.append('file', file);
    onSuccess('Ok');
  };

  useEffect(() => {
    if (
      bulkImports?.getExcelColumns?.csvFiles?.length > 0 &&
      bulkImports.getExcelColumns.csvFiles !== null &&
      delimitFlag
    ) {
      setDelimitModalShow(true);
    }
    if (bulkImports.getExcelColumns.data || bulkImports.getExcelColumns.csvFiles?.length > 0) {
    
      bulkImports.getExcelColumns.data?.map(async (x: any) => {
        const mappingData = x.file_mapping.length > 0 ? x.file_mapping.filter(data => data.is_select == true) : [];
        setRecords((records) => {
          const dummyRecords = _.cloneDeep(records);
          let filteredRecords = dummyRecords.filter(
            (data) => data.filename !== x.filename && data.original_filename !== x.original_filename
          );
          (x?.excel_sheet_columns || []).map((sheet) => {
            const mappingSheet = mappingData.length > 0 ? mappingData[0]?.config_excel_column_mappings?.filter(data => data.sheet_name == sheet.sheet) : [];
            filteredRecords = [
              ...filteredRecords,
              {
                index: currentIndex++,
                filename: x.filename,
                original_filename: x.original_filename,
                delimiter: mappingData.length > 0 ? mappingData[0].delimiter : null,
                table_name: mappingData.length > 0 ? (mappingSheet.length > 0 ? mappingSheet[0]?.table_name : tableName) : tableName,
                header_row: mappingData.length > 0 ? (mappingData[0].header_row + 1) : 1,
                sheet: sheet.sheet,
                columns: sheet.columns,
                currentMapping:
                  x.file_mapping && x.file_mapping.length > 0
                    ? (mappingData.length > 0 ? ((mappingSheet.length > 0 ? mappingSheet[0]?.sheet_name : '')) : '' )
                    : null,
                excel_to_sql_mapping:
                  x.file_mapping && x.file_mapping.length > 0
                    ? (mappingData.length > 0 ? (mappingSheet.length > 0 ? JSON.parse(mappingSheet[0]?.mapping) : null) : null)
                    : null,
                show_mapping: x.file_mapping  ? x.file_mapping : null,
              },
            ];
          });

          return filteredRecords;
        });
      });
      setDefaultFileList([]);
    }
  }, [bulkImports.getExcelColumns.data, bulkImports.getExcelColumns.csvFiles]);

  useEffect(() => {
    if (
      bulkImports.getCSVExcelColumns.data !== null &&
      bulkImports.getCSVExcelColumns.data?.length > 0
    ) {
      bulkImports.getCSVExcelColumns.data?.map(async (x: any) => {
        setRecords((records) => {
          const dummyRecords = _.cloneDeep(records);
          let filteredRecords = dummyRecords.filter(
            (data) => data.filename !== x.filename && data.original_filename !== x.original_filename
          );
          (x?.excel_sheet_columns || []).map((sheet) => {
            filteredRecords = [
              ...filteredRecords,
              {
                index: currentIndex++,
                filename: x.filename,
                original_filename: x.original_filename,
                table_name: tableName,
                header_row: 1,
                sheet: sheet.sheet,
                columns: sheet.columns,
                currentMapping:
                  x.file_mapping && x.file_mapping.length > 0
                    ? x.file_mapping[0].config_excel_column_mappings[0]?.sheet_name
                    : null,
                excel_to_sql_mapping:
                  x.file_mapping && x.file_mapping.length > 0
                    ? JSON.parse(x.file_mapping[0]?.config_excel_column_mappings[0]?.mapping)
                    : null,
                show_mapping: x.file_mapping ? x.file_mapping : null,
              },
            ];
          });

          return filteredRecords;
        });
      });
    }
    if (
      bulkImports.getCSVExcelColumns.csvFiles !== null &&
      bulkImports.getCSVExcelColumns.csvFiles?.length > 0
    ) {
      if (
        bulkImports.getCSVExcelColumns.csvFiles !== null &&
        delimitFlag &&
        bulkImports.getCSVExcelColumns.csvFiles?.length > 0
      ) {
        toast.info('Please Select Proper Delimiters');
        setDelimitModalShow(true);
      }
    }
  }, [bulkImports.getCSVExcelColumns.data, bulkImports.getCSVExcelColumns.csvFiles]);

  const updateRecords = () => {
    if (formUpload?.getFieldValue('table_name')) {
      const dummyRecords = _.cloneDeep(records);
      setLoading(true);
      for (let index = 0; index < dummyRecords.length; index++) {
        const data = dummyRecords[index];
            data.table_name = formUpload?.getFieldValue('table_name');
            data.excel_to_sql_mapping = null;
          }
      setRecords(dummyRecords);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateRecords();
  }, [formUpload?.getFieldValue('table_name')]);

  useEffect(() => {
    if (bulkImports.bulkInsert.messages.length > 0 && (count.save > 0 || count.reset > 0)) {
      if (bulkImports.bulkInsert.hasErrors) {
        toast.error(bulkImports.bulkInsert.messages.join(' '));
      } else {
        toast.success(bulkImports.bulkInsert.messages.join(' '));
        dispatch(clearExcelColumns());
        dispatch(clearBulkImportMessages());
        setRecords([]);
        currentIndex = 1;
        //setExcelColumnState([]);
        setDefaultFileList([]);
        onCancel();
        if (table) {
          history.goBack();
        }
      }
    }
  }, [bulkImports.bulkInsert.messages]);

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

  useEffect(() => {
    return () => {
      dispatch(clearGetTableColumns());
      dispatch(clearBulkImport());
      currentIndex = 1;
    };
  }, []);

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

  const getFileMappingCall = (formData: any) => {
    dispatch(getExcelColumns(formData));
  };

  const handleOnChange = (info) => {
    const { file, fileList } = info;

    const updatedFileList = [];
    fileList?.forEach((element) => {
      updatedFileList?.push(element.originFileObj ? element.originFileObj : element);
    });
    setDefaultFileList(updatedFileList);
    if (file.status === 'removed') {
      if (fileList?.length === 0) {
        dispatch(clearExcelColumns());
        //setExcelColumnState([]);
        //setDefaultFile(null);
      } //else {
      // const result = excelColumnState.filter((o) =>
      //   fileList.some(({ name }) => o.original_filename === name)
      // );
      // setExcelColumnState(result);
      //}
    } else if (file.status === 'done') {
      const formData = new FormData();
      fileList?.forEach((ele) => {
        formData.append('file', ele.originFileObj ? ele.originFileObj : ele);
      });
      try {
        if (getFileMappingTimeOut) {
          clearTimeout(getFileMappingTimeOut);
        }
        getFileMappingTimeOut = setTimeout(() => {
          getFileMappingCall(formData);
        }, 1000);
      } catch (err) {
        toast.error(err?.toString());
      }
      //setDefaultFile(fileList);
    }
    formUpload.setFieldsValue({ sheet_name: '' });
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

  const handleIndeterminate = () => {
    const selectedTables = bulkImports.getTablesForImport.data.filter(
      (table) => table.is_available
    );
    setIndeterminate(
      !!selectedTables.length && selectedTables.length < bulkImports.getTablesForImport.data.length
    );
    setCheckAll(selectedTables.length === bulkImports.getTablesForImport.data.length);
  };

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

  const dateChange = (e) => {
    setDate(moment(e).format(Common.DATEFORMAT));
  };

  const onCancel = () => {
    dispatch(clearExcelColumns());
    //setExcelColumnState([]);
    setCount({ save: 0, reset: 0 });
    const tbName = formUpload?.getFieldValue('table_name');
    formUpload.resetFields();
    formUpload.setFieldsValue({ table_name: tbName });
    setDefaultFileList([]);
    setRecords([]);
    currentIndex = 1;
    setTableName(tbName);
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
          <div className="right-title">
            <GlobalSearch />
          </div>
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
        <div>
          <div className="main-card">
            <div>
              <Form form={formUpload} name="formUpload" initialValues={formUploadInitialValues}>
                <Row gutter={[30, 30]} className="align-item-start">
                  <Col xs={24} md={8}>
                    <label className="label w-100"></label>
                    <Form.Item name={'upload_file'} className="m-0">
                      <div className="upload-file">
                        <Dragger
                          accept=".xls,.xlsx,.csv,.txt"
                          customRequest={uploadFile}
                          multiple={true}
                          onChange={handleOnChange}
                          fileList={defaultFileList}
                          className="py-sm"
                          showUploadList={false}
                        >
                          <UploadOutlined />
                          <span className="ant-upload-text"> Click or drag file </span>
                        </Dragger>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="form-group m-0">
                      <label className="label">Table Name</label>
                      <Form.Item name={'table_name'} className="m-0">
                        <Select
                          loading={bulkImports.getTables.loading || loading}
                          onChange={(name: string) => {
                            setTableName(name);
                          }}
                          showSearch
                          allowClear
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
                  <Col xs={24} md={8}>
                    <div className="form-group m-0">
                      <label className="label">Date Added</label>
                      <Form.Item
                        name="date_added"
                        className="m-0"
                        rules={[{ required: true, message: 'Date Is Required' }]}
                      >
                        <DatePicker
                          className="w-100"
                          defaultValue={moment()}
                          onChange={dateChange}
                          placeholder="Select Date Added"
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <br />
          <br />
          {bulkImports.getExcelColumns.loading ? (
            <div className="spin-loader">
              <Spin spinning={true} />
            </div>
          ) : records?.length > 0 ? (
            <>
              {/* {bulkImports.getExcelColumns.data?.map(
              (data: any, index) =>
                excelColumnState?.find((x) => x.original_filename === data.original_filename) && ( */}
              <>
                <RenderBI
                  //handleSave={(data: any) => handleSave(data)}
                  count={count}
                  form={form}
                  date={date}
                  fileData={null}
                  records={records}
                  loading={loading}
                  setLoading={setLoading}
                  setDelimitFlag={setDelimitFlag}
                  setRecords={setRecords}
                  //seqNumber={index + 1}
                  table={tableName}
                ></RenderBI>
                <br />
                <hr />
              </>
            </>
          ) : (
            <></>
          )}
          {delimitModalShow && (
            <>
              <CkeckDelimiterModal
                setRecords={setRecords}
                records={records}
                tableName={tableName}
                showModal={delimitModalShow}
                handleModalClose={() => {
                  setDelimitModalShow(false);
                }}
              />
            </>
          )}
          <div className="btns-block">
            {Object.values(globalLookups.search)?.filter((x) => x > 0)?.length < 3 ? (
              <Popover
                content={<>Please select global filter and Date Added first!</>}
                trigger="click"
              >
                <Button
                  type="primary"
                  disabled={records?.length == 0}
                  loading={bulkImports.bulkInsert.loading}
                >
                  Save
                </Button>
              </Popover>
            ) : (
              <Button
                type="primary"
                disabled={records?.length == 0}
                loading={bulkImports.bulkInsert.loading}
                onClick={() => {
                  setCount({ ...count, save: count.save + 1 });
                }}
              >
                Save
              </Button>
            )}
            <Button
              type="primary"
              onClick={() => {
                setCount({ save: 0, reset: count.reset + 1 });
                onCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkImport;
