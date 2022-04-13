import { Button, Checkbox, Col, DatePicker, Form, Popover, Row, Select, Spin, Switch } from 'antd';
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
  setExcelColumnsProgress,
  setTableForImport,
} from '../../../store/bulkImport/bulkImport.reducer';
import { useEffect, useState } from 'react';
import {
  getExcelColumns,
  getExcelFileMappingLookup,
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
import commonService from '../../../services/common/common.service';
import { getSimpleDate } from '../../../common/helperFunction';

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
  const [hideUnmapped, setHideUnmapped] = useState(true);
  const [formUpload] = Form.useForm();
  const [form] = Form.useForm();

  let { table } = useParams<{ table: string }>();
  table && (table = decodeURIComponent(table));
  const [count, setCount] = useState({ save: 0, reset: 0 });
  const [recordLength, setRecordLength] = useState(0);
  const [firstFlag, setFirstFlag] = useState(false);
  const [repeatSheetFlag, setRepeatSheetFlag] = useState(false);
  const [tableName, setTableName] = useState<string>(table);
  const [withoutUnmappedRecords, setWithoutUnmappedRecords] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([]);
  const [defaultDelimeter, setDefaultDelimeter] = useState([]);
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
      is_dynamic_header: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [delimitModalShow, setDelimitModalShow] = useState(false);
  const [delimitFlag, setDelimitFlag] = useState(true);
  const [date, setDate] = useState(getSimpleDate().format(Common.DATEFORMAT));
  const [dateChangeFlag, setDateChangeFlag] = useState(true);
  const [mappings, setMappings] = useState([]);
  const [expandedRecords, setExpandedRecords] = useState(null);
  const [columnTableArray, setColumnTableArray] = useState<any>([]);

  const formUploadInitialValues = {
    header_row: 1,
    table_name: table,
    hide_unmapped: true,
    date_added: getSimpleDate(),
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
      if (!repeatSheetFlag) {
        bulkImports.getExcelColumns.data?.map(async (x: any) => {
          const mappingData =
            x.file_mapping.length > 0
              ? x.file_mapping.filter((data) => data.is_select == true)
              : [];
          setRecords((records) => {
            const dummyRecords = _.cloneDeep(records);
            let filteredRecords = dummyRecords.filter(
              (data) =>
                data.filename !== x.filename && data.original_filename !== x.original_filename
            );
            (x?.excel_sheet_columns || []).map((sheet) => {
              const mappingSheet =
                mappingData.length > 0
                  ? mappingData[0]?.config_excel_column_mappings?.filter(
                    (data) => data.sheet_name == sheet.sheet
                  )
                  : [];
              if (mappingData.length) {
                formUpload.setFieldsValue({ hide_unmapped: false });
                setHideUnmapped(false);
              }

              filteredRecords = [
                ...filteredRecords,
                {
                  index: currentIndex++,
                  filename: x.filename,
                  original_filename: x.original_filename,
                  is_public: mappingData.length > 0 ? mappingData[0].is_public : false,
                  key_word: mappingData.length > 0 ? mappingData[0].key_word : null,
                  delimiter: mappingData.length > 0 ? mappingData[0].delimiter : null,
                  date: date,
                  table_name:
                    mappingData.length > 0
                      ? mappingSheet.length > 0
                        ? mappingSheet[0]?.table_name
                        : tableName
                      : tableName,
                  header_row:
                    mappingData.length > 0
                      ? mappingSheet.length > 0
                        ? mappingSheet[0]?.header_row + 1
                        : 1
                      : 1,
                  is_dynamic_header:
                    mappingData.length > 0
                      ? mappingSheet.length > 0
                        ? mappingSheet[0]?.is_dynamic_header
                        : false
                      : false,
                  sheet: sheet.sheet,
                  columns: sheet.columns,
                  currentMapping:
                    x.file_mapping && x.file_mapping.length > 0
                      ? mappingData.length > 0
                        ? mappingSheet.length > 0
                          ? mappingSheet[0]?.sheet_name + '!' + mappingSheet[0]?.id
                          : ''
                        : ''
                      : null,
                  excel_to_sql_mapping:
                    x.file_mapping && x.file_mapping.length > 0
                      ? mappingData.length > 0
                        ? mappingSheet.length > 0
                          ? JSON.parse(mappingSheet[0]?.mapping)
                          : null
                        : null
                      : null,
                  show_mapping: x.file_mapping ? x.file_mapping : null,
                },
              ];
            });

            return filteredRecords;
          });
        });
      } else {
        const realData = _.cloneDeep(records);
        bulkImports.getExcelColumns.data?.map(async (x: any) => {
          const mappingData =
            x.file_mapping.length > 0
              ? x.file_mapping.filter((data) => data.is_select == true)
              : [];
          setRecords((records) => {
            const dummyRecords = _.cloneDeep(records);
            let filteredRecords = dummyRecords;
            (x?.excel_sheet_columns || []).map((sheet) => {
              let nonRepeated = true;
              realData.map((data) => {
                if (data.sheet == sheet.sheet && data.original_filename == x.original_filename) {
                  nonRepeated = false;
                }
              });
              const mappingSheet =
                mappingData.length > 0
                  ? mappingData[0]?.config_excel_column_mappings?.filter(
                    (data) => data.sheet_name == sheet.sheet
                  )
                  : [];
              if (mappingData.length) {
                formUpload.setFieldsValue({ hide_unmapped: false });
                setHideUnmapped(false);
              }

              if (nonRepeated) {
                filteredRecords = [
                  ...filteredRecords,
                  {
                    index: currentIndex++,
                    filename: x.filename,
                    original_filename: x.original_filename,
                    is_public: mappingData.length > 0 ? mappingData[0].is_public : false,
                    key_word: mappingData.length > 0 ? mappingData[0].key_word : null,
                    delimiter: mappingData.length > 0 ? mappingData[0].delimiter : null,
                    date: date,
                    table_name:
                      mappingData.length > 0
                        ? mappingSheet.length > 0
                          ? mappingSheet[0]?.table_name
                          : tableName
                        : tableName,
                    header_row:
                      mappingData.length > 0
                        ? mappingSheet.length > 0
                          ? mappingSheet[0]?.header_row + 1
                          : 1
                        : 1,
                    is_dynamic_header:
                      mappingData.length > 0
                        ? mappingSheet.length > 0
                          ? mappingSheet[0]?.is_dynamic_header
                          : false
                        : false,
                    sheet: sheet.sheet,
                    columns: sheet.columns,
                    currentMapping:
                      x.file_mapping && x.file_mapping.length > 0
                        ? mappingData.length > 0
                          ? mappingSheet.length > 0
                            ? mappingSheet[0]?.sheet_name + '!' + mappingSheet[0]?.id
                            : ''
                          : ''
                        : null,
                    excel_to_sql_mapping:
                      x.file_mapping && x.file_mapping.length > 0
                        ? mappingData.length > 0
                          ? mappingSheet.length > 0
                            ? JSON.parse(mappingSheet[0]?.mapping)
                            : null
                          : null
                        : null,
                    show_mapping: x.file_mapping ? x.file_mapping : null,
                  },
                ];
              }
            });

            return filteredRecords;
          });
        });
      }
      setDefaultFileList([]);
      setRepeatSheetFlag(false);
    }
  }, [bulkImports.getExcelColumns.data, bulkImports.getExcelColumns.csvFiles]);

  useEffect(() => {
    if (
      bulkImports.getCSVExcelColumns.data !== null &&
      bulkImports.getCSVExcelColumns.data?.length > 0
    ) {
      bulkImports.getCSVExcelColumns.data?.map(async (x: any) => {
        const mappingData =
          x.file_mapping.length > 0 ? x.file_mapping.filter((data) => data.is_select == true) : [];
        setRecords((records) => {
          const dummyRecords = _.cloneDeep(records);
          const defDel = defaultDelimeter.filter(
            (data) => data.original_filename == x.original_filename
          )[0]?.delimiter;
          let filteredRecords = dummyRecords.filter(
            (data) => data.filename !== x.filename && data.original_filename !== x.original_filename
          );
          const orgFile = dummyRecords.filter(
            (data) => data.filename == x.filename && data.original_filename == x.original_filename
          );
          (x?.excel_sheet_columns || []).map((sheet) => {
            const mappingSheet =
              mappingData.length > 0
                ? mappingData[0]?.config_excel_column_mappings?.filter(
                  (data) => data.sheet_name == sheet.sheet
                )
                : [];
            if (mappingData.length) {
              formUpload.setFieldsValue({ hide_unmapped: false });
              setHideUnmapped(false);
            }

            filteredRecords = [
              ...filteredRecords,
              {
                index: firstFlag
                  ? orgFile.length > 0
                    ? orgFile[0].index
                    : currentIndex++
                  : currentIndex++,
                filename: x.filename,
                is_public: mappingData.length > 0 ? mappingData[0].is_public : false,
                key_word: mappingData.length > 0 ? mappingData[0].key_word : null,
                original_filename: x.original_filename,
                delimiter: defDel && defDel.length ? defDel : ';',
                date: date,
                table_name: !firstFlag
                  ? mappingData.length > 0
                    ? mappingSheet.length > 0
                      ? mappingSheet[0]?.table_name
                      : tableName
                    : tableName
                  : orgFile.length > 0
                    ? orgFile[0].table_name
                    : tableName,
                header_row:
                  mappingData.length > 0
                    ? mappingSheet.length > 0
                      ? mappingSheet[0]?.header_row + 1
                      : 1
                    : 1,
                is_dynamic_header:
                  mappingData.length > 0
                    ? mappingSheet.length > 0
                      ? mappingSheet[0]?.is_dynamic_header
                      : false
                    : false,
                sheet: sheet.sheet,
                columns: sheet.columns,
                currentMapping:
                  x.file_mapping && x.file_mapping.length > 0
                    ? mappingData.length > 0
                      ? mappingSheet.length > 0
                        ? mappingSheet[0]?.sheet_name + '!' + mappingSheet[0]?.id
                        : ''
                      : ''
                    : null,
                excel_to_sql_mapping: !firstFlag
                  ? x.file_mapping && x.file_mapping.length > 0
                    ? mappingData.length > 0
                      ? mappingSheet.length > 0
                        ? JSON.parse(mappingSheet[0]?.mapping)
                        : null
                      : null
                    : null
                  : orgFile.length > 0
                    ? orgFile[0].excel_to_sql_mapping
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

  const updateRecords = async () => {
    if (formUpload?.getFieldValue('table_name')) {
      const dummyRecords = _.cloneDeep(records);
      setLoading(true);
      for (let index = 0; index < dummyRecords.length; index++) {
        const data = dummyRecords[index];
        data.table_name = formUpload?.getFieldValue('table_name');
        data.excel_to_sql_mapping = null;
      }
      await commonService.getTableColumns(formUpload?.getFieldValue('table_name')).then((res) => {
        if (res) setColumnTableArray(res);
      });
      setLoading(false);
      setMapping(dummyRecords);
    }
  };

  // useEffect(() => {
  //   updateRecords();
  // }, [formUpload?.getFieldValue('table_name')]);

  useEffect(() => {
    if (bulkImports.bulkInsert.messages.length > 0 && (count.save > 0 || count.reset > 0)) {
      if (bulkImports.bulkInsert.hasErrors) {
        toast.error(bulkImports.bulkInsert.messages.join(' '));
      } else {
        toast.warning(bulkImports.bulkInsert.messages.join(' '));
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
    const data = {
      tenant_id: globalLookups.search.tenant_id ? globalLookups.search.tenant_id : null,
      company_id: globalLookups.search.company_id ? globalLookups.search.company_id : null,
      bu_id: globalLookups.search.bu_id ? globalLookups.search.bu_id : null,
    };
    dispatch(getExcelFileMappingLookup(data));
    if (tableName) {
      updateRecords();
    }
    return () => {
      dispatch(clearGetTableColumns());
      dispatch(clearBulkImport());
      currentIndex = 1;
    };
  }, []);

  useEffect(() => {
    if (bulkImports.getExcelFileMappingLookup.data.length) {
      const data = {
        tenant_id: globalLookups.search.tenant_id ? globalLookups.search.tenant_id : null,
        company_id: globalLookups.search.company_id ? globalLookups.search.company_id : null,
        bu_id: globalLookups.search.bu_id ? globalLookups.search.bu_id : null,
      };
      dispatch(getExcelFileMappingLookup(data));
    }
  }, [globalLookups.search.bu_id, globalLookups.search.company_id, globalLookups.search.tenant_id]);

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

  const callbackProgress = (currentProgress: number) => {
    dispatch(setExcelColumnsProgress(currentProgress));
  };

  const getFileMappingCall = (formData: any) => {
    setRepeatSheetFlag(true);
    const tenantID = globalLookups.search.tenant_id ? globalLookups.search.tenant_id : null;
    const companyID = globalLookups.search.company_id ? globalLookups.search.company_id : null;
    const buID = globalLookups.search.bu_id ? globalLookups.search.bu_id : null;
    dispatch(getExcelColumns({ file: formData, callbackProgress, tenantID, companyID, buID }));
  };

  const handleOnChange = (info) => {
    const { file, fileList } = info;

    const updatedFileList = [];
    fileList?.forEach((element) => {
      if (records?.filter((data) => data.original_filename === element.originFileObj).length === 0)
        updatedFileList?.push(element.originFileObj ? element.originFileObj : element);
    });
    setDefaultFileList(updatedFileList);
    if (file.status === 'removed') {
      if (fileList?.length === 0) {
        dispatch(clearExcelColumns());
      }
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
    if (expandedRecords !== null && expandedRecords?.length > 0) {
      setDateChangeFlag(false);
    }
    setDate(moment(e).format(Common.DATEFORMAT));
    const dummyRecord = _.cloneDeep(records);
    dummyRecord.map((data) => {
      data.date = e;
    });
    setRecords(dummyRecord);
  };

  const onCancel = () => {
    dispatch(clearExcelColumns());
    //setExcelColumnState([]);
    if (bulkImports.getExcelColumns.progress !== null && commonService.cancelTokenSource !== null) {
      commonService.cancelTokenSource.cancel();
    }
    setCount({ save: 0, reset: 0 });
    const tbName = formUpload?.getFieldValue('table_name');
    const date1 = formUpload?.getFieldValue('date_added');
    formUpload.resetFields();
    formUpload.setFieldsValue({ table_name: tbName });
    formUpload.setFieldsValue({ date_added: date1 });
    setHideUnmapped(true);
    setDate(date1);
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

  const onSwitchChange = (e) => {
    setHideUnmapped(e);
  };

  const changeFileMapping = (value) => {
    setMappings([]);
    formUpload.setFieldsValue({ tab_mapping: null });
    const keyword = value?.split('|')[0];
    const dummyRecord = _.cloneDeep(bulkImports.getExcelFileMappingLookup.data);
    const selectedRecord = dummyRecord.filter((data) => data.key_word === keyword);
    if (value !== undefined && value !== null) {
      setMappings(selectedRecord[0]?.config_excel_column_mappings);
    }
    const dummyRecords = _.cloneDeep(records);
    dummyRecords.map((data) => {
      data.currentMapping = null;
      data.header_row = 1;
      data.table_name = null;
    });

    if (selectedRecord.length) {
      selectedRecord[0].config_excel_column_mappings?.map((data) => {
        dummyRecords.map((data1) => {
          if (data.sheet_name == data1.sheet) {
            data1.currentMapping = data.sheet_name;
            data1.excel_to_sql_mapping = JSON.parse(data.mapping);
            data1.header_row = data.header_row + 1;
            data1.table_name = data.table_name;
            data1.key_word = selectedRecord[0].key_word;
            data1.is_public = selectedRecord[0].is_public;
            data1.is_dynamic_header = selectedRecord[0].is_dynamic_header;
          }
        });
      });
      const dummy = _.cloneDeep(dummyRecords);
      const unmapRec = dummy.filter(
        (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
      );
      setWithoutUnmappedRecords(unmapRec);
      setRecords(dummyRecords);
    }
  };

  const changeTabMapping = (value) => {
    if (value === undefined) {
      const dummyRecord = _.cloneDeep(bulkImports.getExcelFileMappingLookup.data);
      const keyValue = dummyRecord.filter(
        (data) => data.id === mappings[0]?.excel_file_mapping_id
      )[0];
      changeFileMapping(keyValue?.key_word + '|' + keyValue?.file_type);
    } else {
      const dummyRecord = _.cloneDeep(mappings);
      const selectedRecord = dummyRecord.filter((data) => data.sheet_name === value);
      const dummyRecords = _.cloneDeep(records);

      if (selectedRecord.length > 0) {
        dummyRecords.map((data1) => {
          data1.currentMapping = selectedRecord[0].sheet_name;
          data1.excel_to_sql_mapping = JSON.parse(selectedRecord[0].mapping);
          data1.header_row = selectedRecord[0].header_row + 1;
          data1.is_dynamic_header = selectedRecord[0].is_dynamic_header + 1;
          data1.table_name = selectedRecord[0].table_name;
        });
        const dummy = _.cloneDeep(dummyRecords);
        const unmapRec = dummy.filter(
          (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
        );
        setWithoutUnmappedRecords(unmapRec);
        setRecords(dummyRecords);
      }
    }
  };

  const setMapping = async (dummyRecords = null) => {
    if (dummyRecords === null) {
      dummyRecords = _.cloneDeep(records);
    }
    await dummyRecords.map((data) => {
      if (data && data.table_name !== undefined) {
        if (data.excel_to_sql_mapping == null) {
          if (columnTableArray) {
            const response: any = columnTableArray;
            const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
            let filterExcelColumns: any = data.columns;
            const filterTableColumns = response?.filter(
              (x) => !columnsArray.includes(x.name?.toLowerCase())
            );
            if (filterExcelColumns?.length >= data.header_row) {
              filterExcelColumns = filterExcelColumns[data.header_row - 1];
            }
            const ExcelColsSorted = [...filterExcelColumns];
            ExcelColsSorted.sort();

            const initialValuesData: any = {};
            const sqlToExcelMapping = [];
            filterTableColumns.map(function (ele) {
              initialValuesData[ele.name] = ExcelColsSorted.filter(
                (x: any) =>
                  x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                  ele.name?.toLowerCase()?.replace(/\s/g, '')
              )[0];
              data.validation =
                ele.is_nullable == 'NO' && initialValuesData[ele.name] == undefined
                  ? true
                  : data.validation;
              sqlToExcelMapping.push({
                key: `${ele.name}`,
                value:
                  initialValuesData[ele.name] == undefined ? '' : `${initialValuesData[ele.name]}`,
              });
            });
            data.excel_to_sql_mapping = sqlToExcelMapping;
          }
        }
      }
    });
    setRecords(dummyRecords);
  };

  useEffect(() => {
    const dummyRecords = _.cloneDeep(records);
    const unmapRec = dummyRecords.filter(
      (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
    );
    setWithoutUnmappedRecords(unmapRec);
    setRecordLength(records.length);
    if (records.length > recordLength) {
      setMapping();
    }
  }, [records]);

  function beforeUpload(file) {
    const type = file?.name?.slice(((file?.name.lastIndexOf('.') - 1) >>> 0) + 2);
    const dummyRecords = _.cloneDeep(records);
    const duplicateFile = dummyRecords?.filter((data) => data.original_filename === file?.name);
    if (duplicateFile && duplicateFile.length) {
      toast.error(file?.name + ' File Name already exist');
      return false;
    }
    const isJpgOrPng = type === 'xls' || type === 'xlsx' || type === 'csv' || type === 'txt';
    if (!isJpgOrPng) {
      toast.error('You can only upload XLS/XLSX/CSV/TXT file!');
      return false;
    }
    return isJpgOrPng;
  }

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
                          beforeUpload={beforeUpload}
                          accept=".xls,.xlsx,.csv,.txt"
                          customRequest={uploadFile}
                          multiple={true}
                          onChange={handleOnChange}
                          fileList={defaultFileList}
                          className="py-sm"
                          showUploadList={false}
                        >
                          <UploadOutlined />
                          <span className="ant-upload-text">
                            {bulkImports.getExcelColumns.progress === null
                              ? ' Click or drag file'
                              : ` Uploading... (${bulkImports.getExcelColumns.progress}%)`}
                          </span>
                        </Dragger>
                        <span style={{ color: 'red', textAlign: 'center' }}>
                          {'File Type Supported: [.xls, .xlsx, .csv, .txt]'}
                        </span>
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
                            updateRecords();
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
                  <Col xs={24} md={4}>
                    <div className="form-group m-0">
                      <label className="label">Date Added</label>
                      <Form.Item
                        name="date_added"
                        className="m-0"
                        rules={[{ required: true, message: 'Date Is Required' }]}
                      >
                        <DatePicker
                          className="w-100"
                          onChange={dateChange}
                          placeholder="Select Date Added"
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    <div className="form-group form-inline-pt m-0">
                      <Form.Item name="hide_unmapped" className="m-0" valuePropName="checked">
                        <Switch className="form-control" onChange={onSwitchChange} />
                      </Form.Item>
                      <label className="label">Show All Tabs</label>
                    </div>
                  </Col>
                  {records.length > 0 && (
                    <Col xs={24} md={8}>
                      <div className="form-group m-0">
                        <label className="label">File Mapping</label>
                        <Form.Item name={'file_mapping'} className="m-0">
                          <Select
                            loading={bulkImports.getExcelFileMappingLookup.loading || loading}
                            onChange={(option) => {
                              changeFileMapping(option);
                            }}
                            showSearch
                            dropdownClassName="value-box-select"
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option: any) =>
                              option.children
                                ?.toString()
                                .toLowerCase()
                                ?.indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              optionA.children
                                ?.toString()
                                .toLowerCase()
                                ?.localeCompare(optionB.children?.toString().toLowerCase())
                            }
                          >
                            {(bulkImports.getExcelFileMappingLookup.data || [])?.map(
                              (option: any, index: number) => (
                                <Option
                                  key={index}
                                  value={option.key_word + '|' + option.file_type}
                                >
                                  {option.key_word}
                                  <span className="value-badge">{option.file_type}</span>
                                </Option>
                              )
                            )}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                  {mappings?.length > 0 && records.length > 0 && (
                    <Col xs={24} md={8}>
                      <div className="form-group m-0">
                        <label className="label">Tab Mapping</label>
                        <Form.Item name={'tab_mapping'} className="m-0">
                          <Select
                            onChange={(option) => {
                              changeTabMapping(option);
                            }}
                            showSearch
                            dropdownClassName="value-box-select"
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option: any) =>
                              option.children
                                ?.toString()
                                .toLowerCase()
                                ?.indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              optionA.children
                                ?.toString()
                                .toLowerCase()
                                ?.localeCompare(optionB.children?.toString().toLowerCase())
                            }
                          >
                            {(mappings || [])?.map((option: any, index: number) => (
                              <Option key={index} value={option.sheet_name}>
                                {option.sheet_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                </Row>
              </Form>
            </div>
          </div>
          <br />
          <br />
          {bulkImports.getExcelColumns.loading && records?.length == 0 ? (
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
                  firstFlag={firstFlag}
                  setFirstFlag={setFirstFlag}
                  hideUnmapped={hideUnmapped}
                  withoutUnmappedRecords={withoutUnmappedRecords}
                  setWithoutUnmappedRecords={setWithoutUnmappedRecords}
                  dateChangeFlag={dateChangeFlag}
                  setDateChangeFlag={setDateChangeFlag}
                  setExpandedRecords={setExpandedRecords}
                  expandedRecords={expandedRecords}
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
                setDefaultDelimeter={setDefaultDelimeter}
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
                content={<>Please select Global Filters and &apos;Date Added&apos; first!</>}
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
                  setMappings([]);
                  setCount({ ...count, save: count.save + 1 });
                }}
              >
                Save
              </Button>
            )}
            <Button
              type="primary"
              onClick={() => {
                setMappings([]);
                setCount({ save: 0, reset: count.reset + 1 });
                onCancel();
                if (records.length) {
                  const fileName = [];
                  const dummyRecord = _.cloneDeep(records);
                  dummyRecord.map((data) => {
                    if (fileName.indexOf(data.filename) === -1) {
                      fileName.push(data.filename);
                    }
                  });
                  commonService.deleteFileForBulkImport(fileName);
                }
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
