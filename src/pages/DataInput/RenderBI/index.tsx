import { Button, DatePicker, Form, Popconfirm, Select, Table, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  bulkInsert,
  deleteColumnMapping,
  deleteFileMapping,
  getExcelFileMappingLookup,
  getTables,
} from '../../../store/bulkImport/bulkImport.action';
import {
  clearExcelColumns,
  bulkImportSelector,
  clearBulkImportMessages,
  clearDeleteMessages,
} from '../../../store/bulkImport/bulkImport.reducer';
import { IDatabaseTable } from '../../../services/common/common.model';
import moment from 'moment';
import PreviewExcel from '../PreviewExcelFile/previewExcelFile';
import MappingColumn from './../MappingColumn/MappingColumn';
import { IRenderBIProps } from './renderBI.model';
import _ from 'lodash';
import commonService from '../../../services/common/common.service';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../common/models/common';
import { toast } from 'react-toastify';
import bulkImportService from '../../../services/bulkImport/bulkImport.service';
import { Common } from '../../../common/constants/common';
import { getSimpleDate } from '../../../common/helperFunction';

const { Option } = Select;

const RenderBI: React.FC<IRenderBIProps> = (props) => {
  const {
    count,
    table,
    form,
    records,
    setRecords,
    date,
    loading,
    setLoading,
    setDelimitFlag,
    firstFlag,
    setFirstFlag,
    hideUnmapped,
    withoutUnmappedRecords,
    setWithoutUnmappedRecords,
    dateChangeFlag,
    setDateChangeFlag,
    setExpandedRecords,
    expandedRecords,
  } = props;
  const bulkImports = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const [innerFormUpload] = Form.useForm();

  //const [excelColumns, setExcelColumns] = useState(null);
  const [maxHeaderRow, setMaxHeaderRow] = useState(1);
  const [maxColumn, setColumn] = useState(10);
  const [tableColumns, setTableColumns] = useState(null);
  const [headerRowCount, setHeaderRowCount] = useState(1);
  const [excelPreviewData, setExcelPreviewData] = useState<any>();
  const [showManageExcel, setShowManageExcel] = useState<boolean>(false);
  const [flagForMappingHighlights, setFlagForMappingHighlights] = useState<boolean>(true);
  const [tableColumnState, setTableColumnState] = useState<any>([]);
  const [savedExcelMapping, setSavedExcelMapping] = useState<any>([]);
  const [selectedRowId, setSelectedRowId] = useState<any>();
  const [curRecordMap, setCurRecordMap] = useState(null);

  const changedTableData = async (currRecord: any, tableName: string) => {
    const dummyRecords = _.cloneDeep(records);
    const data = dummyRecords.filter((data) => data.index == currRecord.index);
    if (data && data.length > 0) {
      data[0].table_name = tableName;
      await commonService.getTableColumns(tableName).then((res) => {
        if (res) {
          const response: any = res;
          const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
          let filterExcelColumns: any = data[0].columns;
          const filterTableColumns = response?.filter(
            (x) => !columnsArray.includes(x.name?.toLowerCase())
          );
          if (filterExcelColumns?.length >= data[0].header_row) {
            filterExcelColumns = filterExcelColumns[data[0].header_row - 1];
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
            data[0].validation =
              ele.is_nullable == 'NO' && initialValuesData[ele.name] == undefined
                ? true
                : data[0].validation;
            sqlToExcelMapping.push({
              key: `${ele.name}`,
              value:
                initialValuesData[ele.name] == undefined ? '' : `${initialValuesData[ele.name]}`,
            });
          });
          data[0].excel_to_sql_mapping = sqlToExcelMapping;
        }
      });
      data[0].currentMapping = null;
    }

    setRecords(dummyRecords);
    setLoading(false);
  };

  const handleTableChange = async (currRecord: any, tableName: string) => {
    setLoading(true);
    if (tableName) {
      changedTableData(currRecord, tableName);
    } else {
      setTableColumnState([]);
    }
  };

  // const getDummyMapping = (currentSheetName: string, columns: any) => {
  //   setEmptyMappingFlag(true);
  //   const filterExcelColumns: any = columns[0];
  //   const filterTableColumns = tableColumnState.filter(
  //     (x) => !columnsArray.includes(x.name?.toLowerCase())
  //   );
  //   const initialValuesData: any = {};
  //   const sqlToExcelMapping: any = [];
  //   filterTableColumns.map(function (ele) {
  //     initialValuesData[ele.name] =
  //       filterExcelColumns?.filter(
  //         (x: any) =>
  //           x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
  //           ele.name?.toLowerCase()?.replace(/\s/g, '')
  //       ).length > 0
  //         ? filterExcelColumns.filter(
  //           (x: any) =>
  //             x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
  //             ele.name?.toLowerCase()?.replace(/\s/g, '')
  //         )[0]
  //         : '';
  //     sqlToExcelMapping.push({
  //       key: `${ele.name}`,
  //       value: `${initialValuesData[ele.name]}`,
  //     });
  //   });
  //   for (const x in initialValuesData) {
  //     if (initialValuesData[x] !== '') {
  //       setEmptyMappingFlag(false);
  //     }
  //   }
  //   return sqlToExcelMapping;
  // };

  useEffect(() => {
    if (count.save > 0) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      const arr: Array<{
        excel_to_sql_mapping: any;
        table_name: string;
        file_name: string;
        original_file_name: string;
        sheet_name: string;
        header_row: number;
        delimiter: string;
        foreign_key_values: any;
      }> = [];
      let isMapped = true;
      if (hideUnmapped === false && withoutUnmappedRecords.length) {
        withoutUnmappedRecords.map((data) => {
          if (data.excel_to_sql_mapping && data.validation !== true) {
            const excelData = data.excel_to_sql_mapping.filter((data) => data.value !== '');
            if (excelData.length > 0) {
              data.excel_to_sql_mapping = data.excel_to_sql_mapping?.filter(
                (data) => data.key !== 'Source'
              );
            } else {
              isMapped = false;
              toast.warn('Select some missing mappings for ' + data.original_filename);
            }
          } else {
            isMapped = false;
            toast.error('Select configurations for ' + data.original_filename);
          }
          const Obj = {
            excel_to_sql_mapping: data.excel_to_sql_mapping,
            table_name: data.table_name,
            file_name: data.filename,
            original_file_name: data.original_filename,
            sheet_name: data.sheet,
            header_row: data.header_row - 1,
            delimiter: data.delimiter ? data.delimiter : ',',
            is_dynamic_header: data.is_dynamic_header === true ? true : false,
            foreign_key_values: {
              date_added: data.date
                ? moment(data.date).format(Common.DATEFORMAT)
                : moment(date).format(Common.DATEFORMAT),
            },
          };
          arr.push(Obj);
        });
      } else {
        records.map((data) => {
          if (data.excel_to_sql_mapping && data.validation !== true) {
            const excelData = data.excel_to_sql_mapping.filter((data) => data.value !== '');
            if (excelData.length > 0) {
              data.excel_to_sql_mapping = data.excel_to_sql_mapping?.filter(
                (data) => data.key !== 'Source'
              );
            } else {
              isMapped = false;
              toast.warn('Select some missing mappings for ' + data.original_filename);
            }
          } else {
            isMapped = false;
            toast.error('Select configurations for ' + data.original_filename);
          }
          const Obj = {
            excel_to_sql_mapping: data.excel_to_sql_mapping,
            table_name: data.table_name,
            file_name: data.filename,
            original_file_name: data.original_filename,
            sheet_name: data.sheet,
            header_row: data.header_row - 1,
            delimiter: data.delimiter ? data.delimiter : ',',
            is_dynamic_header: data.is_dynamic_header === true ? true : false,
            foreign_key_values: {
              date_added: data.date
                ? moment(data.date).format(Common.DATEFORMAT)
                : moment(date).format(Common.DATEFORMAT),
            },
          };
          arr.push(Obj);
        });
      }
      const val = {
        excel_sheet_with_mapping_details: arr,
        foreign_key_values: {
          tenant_id: _.isNull(globalSearch.tenant_id)
            ? null
            : globalSearch.tenant_id === undefined
            ? null
            : globalSearch?.tenant_id[0],
          bu_id: _.isNull(globalSearch.bu_id)
            ? null
            : globalSearch.bu_id === undefined
            ? null
            : globalSearch?.bu_id[0],
          company_id: _.isNull(globalSearch.company_id)
            ? null
            : globalSearch.company_id === undefined
            ? null
            : globalSearch?.company_id[0],
          date_added: date
            ? moment(date).format(Common.DATEFORMAT)
            : getSimpleDate().format(Common.DATEFORMAT),
        },
      };
      if (val.excel_sheet_with_mapping_details.length === 0) {
        toast.info('Some Tab are lacking mapping concerns.');
      } else {
        if (isMapped) {
          dispatch(bulkInsert(val));
        }
      }
    }
  }, [count.save]);

  useEffect(() => {
    if (count.reset > 0) {
      resetPage();
      setRecords([]);
    }
  }, [count.reset]);

  const setFormFields = async () => {
    const skipRows =
      Number(innerFormUpload.getFieldValue('header_row')) > 0
        ? Number(innerFormUpload.getFieldValue('header_row')) - 1
        : 0;
    let currentSheetName = innerFormUpload.getFieldValue('sheet_name');
    if (
      !currentSheetName &&
      bulkImports.getExcelColumns.data?.length > 0 &&
      bulkImports.getExcelColumns.data[selectedRowId - 1]?.excel_sheet_columns
    ) {
      currentSheetName =
        bulkImports.getExcelColumns.data[selectedRowId - 1].excel_sheet_columns[0].sheet;
      innerFormUpload.setFieldsValue({ sheet_name: currentSheetName });
    }
    if (
      tableColumnState &&
      bulkImports.getExcelColumns.data?.length > 0 &&
      bulkImports.getExcelColumns.data[selectedRowId - 1]?.excel_sheet_columns
    ) {
      const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
      let filterExcelColumns: any = bulkImports.getExcelColumns.data[
        selectedRowId - 1
      ]?.excel_sheet_columns?.find((e) => e.sheet === currentSheetName)?.columns;
      const filterTableColumns = tableColumnState.filter(
        (x) => !columnsArray.includes(x.name?.toLowerCase())
      );
      if (filterExcelColumns?.length >= skipRows) {
        filterExcelColumns = filterExcelColumns[skipRows];
      }
      // const removedColumns = tableColumnState.filter((x) =>
      //   columnsArray.includes(x.name?.toLowerCase())
      // );
      if (filterExcelColumns && filterExcelColumns?.length) {
        const ExcelColsSorted = [...filterExcelColumns];
        ExcelColsSorted.sort();
      }
      //setExcelColumns(ExcelColsSorted);
      setTableColumns(filterTableColumns);
      //setRemovedColumns(removedColumns);

      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }

      const initialValuesData: any = {
        tenant_id: _.isNull(globalSearch.tenant_id)
          ? null
          : globalSearch.tenant_id === undefined
          ? null
          : globalSearch?.tenant_id[0],
        bu_id: _.isNull(globalSearch.bu_id)
          ? null
          : globalSearch.bu_id === undefined
          ? null
          : globalSearch?.bu_id[0],
        company_id: _.isNull(globalSearch.company_id)
          ? null
          : globalSearch.company_id === undefined
          ? null
          : globalSearch?.company_id[0],
        date_added: getSimpleDate(),
      };
      filterTableColumns.map(function (ele) {
        initialValuesData[ele.name] =
          filterExcelColumns?.filter(
            (x: any) =>
              x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
              ele.name?.toLowerCase()?.replace(/\s/g, '')
          ).length > 0
            ? filterExcelColumns.filter(
                (x: any) =>
                  x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                  ele.name?.toLowerCase()?.replace(/\s/g, '')
              )[0]
            : '';
      });
      form.setFieldsValue(initialValuesData);
    } else {
      form.setFieldsValue({});
      //setExcelColumns(null);
      setTableColumns(null);
    }
  };

  const resetPage = () => {
    setTableColumnState([]);
    dispatch(clearExcelColumns());
    innerFormUpload.resetFields(['upload_file', 'sheet_name', 'header_row']);
    //setExcelColumns(null);
    setTableColumns(null);
  };

  useEffect(() => {
    if (bulkImports.getExcelColumns.data?.length > 0) {
      setFormFields();
      // const sheet_name = bulkImports.getExcelColumns.data[selectedRowId - 1]?.excel_sheet_columns[0]?.sheet;
      //   (e) => e.sheet === sheet_name
      // )?.columns?.length;
    }
  }, [tableColumnState, bulkImports.getExcelColumns.data]);

  useEffect(() => {
    if (!(bulkImports.getTables.data && bulkImports.getTables.data.length > 0)) {
      dispatch(getTables());
    }
    // if (!table) {
    //   dispatch(getTablesForImport());
    // }
  }, [dispatch]);

  useEffect(() => {
    if (table) {
      const currentTable = bulkImports.getTables.data.filter(
        (t) => t.name.toLowerCase() === (table || '').toLowerCase()
      );
      if (currentTable.length > 0) {
        innerFormUpload.setFieldsValue({ table_name: currentTable[0].name });
        //setLoadingTableColumns(true);
      }
    }
  }, [bulkImports.getTables.data, table]);

  const previewData = (csvFlag: boolean, headerValue = 0) => {
    const dummyRecords = csvFlag
      ? bulkImports.getCSVExcelColumns.data[0].excel_sheet_columns[0].columns
      : records.filter((data) => data.index == selectedRowId);
    const currentExcelData = csvFlag ? [...dummyRecords] : [...dummyRecords[0]?.columns];
    currentExcelData?.splice(0, headerValue - 1 > 0 ? headerValue - 1 : 0);
    setExcelPreviewData(currentExcelData);
    if (csvFlag) {
      setColumn(dummyRecords[0]?.length);
      setMaxHeaderRow(dummyRecords?.length);
    } else {
      setColumn(dummyRecords[0].columns[0]?.length);
      setMaxHeaderRow(dummyRecords[0].columns?.length);
    }
    innerFormUpload.setFieldsValue({ header_row: headerValue });
    setFormFields();
  };
  // End: set tables for import

  useEffect(() => {
    const dummyRecords = _.cloneDeep(records);
    const unmapRec = dummyRecords.filter(
      (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
    );
    setWithoutUnmappedRecords(unmapRec);
    return () => {
      // if (records.length) {
      //   const fileName = [];
      //   const dummyRecord = _.cloneDeep(records);
      //   dummyRecord.map((data) => {
      //     if (fileName.indexOf(data.filename) === -1) {
      //       fileName.push(data.filename);
      //     }
      //   });
      //   commonService.deleteFileForBulkImport(fileName);
      // }
      setTableColumnState([]);
    };
  }, []);

  const removeColumnMapping = (id: number) => {
    dispatch(deleteColumnMapping(id));
  };

  const removeFileMapping = (id: number) => {
    dispatch(deleteFileMapping(id));
  };

  const geChildDropdown = (excelMappings: any, currentRecord: any) => {
    const chidDropdown = [];
    excelMappings?.map((m: any) => {
      chidDropdown.push({
        title: (
          <>
            {' '}
            {m.sheet_name}
            {currentRecord.isPublic === true ? (
              <></>
            ) : (
              <Popconfirm
                title={`Delete ${m.sheet_name} Mapping?`}
                onConfirm={() => {
                  removeColumnMapping(m.id);
                  setCurRecordMap(currentRecord);
                }}
              >
                <a href="#" title="" className="deleteMap-btn">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                </a>
              </Popconfirm>
            )}
          </>
        ),
        value: `${m.sheet_name}!${m.id}`,
      });
    });

    return chidDropdown;
  };

  const getMenuDropdown = (recordsDefault: any, curRecord: any) => {
    const dropdown = [];
    recordsDefault?.map((m: any) => {
      dropdown.push({
        title: (
          <>
            {' '}
            {m.key_word}{' '}
            {curRecord?.isPublic === true ? (
              <></>
            ) : (
              <Popconfirm
                title={`Delete ${m.key_word} Mapping?`}
                onConfirm={() => {
                  removeFileMapping(m.id);
                  setCurRecordMap(curRecord);
                }}
              >
                <a href="#" title="" className="deleteMap-btn">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                </a>
              </Popconfirm>
            )}
          </>
        ),
        disabled: true,
        value: `${m.id}-parent`,
        children: geChildDropdown(m.config_excel_column_mappings, curRecord),
      });
    });

    return dropdown;
  };

  useEffect(() => {
    if (bulkImports.saveExcelFileMapping.messages.length > 0) {
      toast.success(bulkImports.saveExcelFileMapping.messages.join(' '));
      const data = {
        tenant_id: globalFilters.search.tenant_id ? globalFilters.search.tenant_id : null,
        company_id: globalFilters.search.company_id ? globalFilters.search.company_id : null,
        bu_id: globalFilters.search.bu_id ? globalFilters.search.bu_id : null,
      };
      dispatch(getExcelFileMappingLookup(data));
      dispatch(clearBulkImportMessages());
      setSavedExcelMapping([]);
    }
  }, [bulkImports.saveExcelFileMapping.messages]);

  const getExcelMappingColumns = async () => {
    const dummyRecord = _.cloneDeep(records);
    for (let index = 0; index < dummyRecord.length; index++) {
      const data = dummyRecord[index];
      if (data.index == curRecordMap.index) {
        let response = null;
        const global_dd = {
          tenant_id: globalFilters.search.tenant_id ? globalFilters.search.tenant_id : null,
          company_id: globalFilters.search.company_id ? globalFilters.search.company_id : null,
          bu_id: globalFilters.search.bu_id ? globalFilters.search.bu_id : null,
        };
        await bulkImportService
          .getExcelFileMapping({
            table_name: curRecordMap.table_name,
            key_word: curRecordMap.original_filename?.split('.')[0],
            file_type: curRecordMap?.original_filename.slice(
              ((curRecordMap?.original_filename.lastIndexOf('.') - 1) >>> 0) + 2
            ),
            global_dd,
          })
          .then((res) => {
            response = res?.body?.data;
          });
        data.currentMapping =
          response && response.length > 0
            ? response[0].config_excel_column_mappings[0]?.sheet_name
            : null;
        data.excel_to_sql_mapping =
          response && response.length > 0
            ? JSON.parse(response[0]?.config_excel_column_mappings[0]?.mapping)
            : null;
        data.show_mapping = response ? response : null;
      }
    }
    setRecords(dummyRecord);
    //if (innerFormUpload?.getFieldValue('table_name') && fileData?.original_filename) {
    // bulkImportService
    //   .getExcelFileMapping({
    //     table_name: innerFormUpload.getFieldValue('table_name'),
    //     key_word: fileData?.original_filename,
    //     file_type:
    //   })
    //   .then((res) => {
    //     setSavedExcelMapping(res?.body?.data);
    //   });
    //}
  };

  useEffect(() => {
    if (bulkImports.deleteColumnMapping.messages.length > 0) {
      if (bulkImports.deleteColumnMapping.hasErrors) {
        toast.error(bulkImports.deleteColumnMapping.messages.join(' '));
      } else {
        toast.success(bulkImports.deleteColumnMapping.messages.join(' '));
        getExcelMappingColumns();
      }
      dispatch(clearDeleteMessages());
    }
  }, [bulkImports.deleteColumnMapping.messages]);

  useEffect(() => {
    if (bulkImports.deleteFileMapping.messages.length > 0) {
      if (bulkImports.deleteFileMapping.hasErrors) {
        toast.error(bulkImports.deleteFileMapping.messages.join(' '));
      } else {
        toast.success(bulkImports.deleteFileMapping.messages.join(' '));
        getExcelMappingColumns();
      }
      dispatch(clearDeleteMessages());
    }
  }, [bulkImports.deleteFileMapping.messages]);

  useEffect(() => {
    if (savedExcelMapping?.length > 0) {
      const defaultSelected = savedExcelMapping?.find((x) => x.is_select === true);
      if (defaultSelected && defaultSelected.config_excel_column_mappings?.length > 0) {
        const selectedMappingOrder = defaultSelected.config_excel_column_mappings[0]?.id;
        innerFormUpload.setFieldsValue({ mapping_order: selectedMappingOrder });
        onChange(null, selectedMappingOrder);
      }
    }
  }, [savedExcelMapping]);

  const onChange = (selectedRecord: any, value: any) => {
    const sheetNameV = value ? value.split('!')[0] : null;
    const idV = value ? value.split('!')[1] : null;
    const dummyRecord = _.cloneDeep(records);
    dummyRecord.map((data) => {
      if (data.index == selectedRecord.index) {
        let flagMapping = null;
        data.currentMapping = value;
        selectedRecord.show_mapping.map((data1) => {
          data1.config_excel_column_mappings.map((data2) => {
            if (data2.sheet_name == sheetNameV && data2.id == idV) {
              data.key_word = data1?.key_word;
              data.is_public = data1?.is_public;
              data.is_dynamic_header = data2?.is_dynamic_header;
              data.table_name = data2.table_name;
              flagMapping = JSON.parse(data2.mapping);
            }
          });
        });
        data.excel_to_sql_mapping = flagMapping;
      }
    });
    const unmapRec = dummyRecord.filter(
      (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
    );
    setWithoutUnmappedRecords(unmapRec);
    setRecords(dummyRecord);
    if (value) {
      const defaultMappingDetail = savedExcelMapping?.filter(
        (x) => x.table_name === innerFormUpload.getFieldValue('table_name')
      );
      let mappingDetail: any = {};
      let skipRows;
      defaultMappingDetail?.forEach((element) => {
        const mappingOrder = element?.config_excel_column_mappings?.find((y) => y.id === value);
        if (mappingOrder) {
          mappingDetail = JSON.parse(mappingOrder?.mapping);
          innerFormUpload.setFieldsValue({ header_row: mappingOrder.header_row });
          setFormFields();
          skipRows = Number(mappingOrder.header_row) - 1;
        }
      });

      if (bulkImports.getExcelColumns.data?.length > 0) {
        let filterExcelColumns: any = bulkImports.getExcelColumns.data[
          selectedRowId - 1
        ]?.excel_sheet_columns?.find(
          (e) => e.sheet === innerFormUpload?.getFieldValue('sheet_name')
        )?.columns;
        if (filterExcelColumns?.length >= skipRows) {
          filterExcelColumns = filterExcelColumns[skipRows];
        }
        tableColumns?.forEach((element) => {
          const mapObj = mappingDetail?.find((x) => x.key === element.name);
          if (mapObj && filterExcelColumns?.includes(mapObj?.value)) {
            form.setFieldsValue({ [element.name]: mapObj.value });
          }
        });
      }
    } else {
      innerFormUpload.setFieldsValue({ header_row: 1 });
      setFormFields();
    }
  };

  const deleteSelected = (index: number, fileName: string) => {
    if (index >= 0) {
      toast.success('Tab deleted successfully');
      const dummyRecords = _.cloneDeep(records);
      let flag = false;
      const filteredRecords = dummyRecords.filter((data) => data.index !== index);
      filteredRecords.map((data) => {
        if (data.filename === fileName) {
          flag = true;
        }
      });
      if (!flag) {
        commonService.deleteFileForBulkImport([fileName]);
      }

      const dummyWithoutRecords = _.cloneDeep(filteredRecords);
      const unmapRec = dummyWithoutRecords.filter(
        (data) => data.currentMapping !== null && data.excel_to_sql_mapping !== null
      );
      setWithoutUnmappedRecords(unmapRec);
      setRecords(filteredRecords);
    }
  };

  const onDateChange = (selectedReord: any, e) => {
    if (e) {
      if (expandedRecords !== null && expandedRecords?.length > 0) {
        setDateChangeFlag(false);
      }
      const dummyRecord = _.cloneDeep(records);
      dummyRecord.map((data) => {
        if (data.index == selectedReord.index) {
          data.date = e;
        }
      });
      setRecords(dummyRecord);
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'File Name',
      dataIndex: 'original_filename',
      key: 'original_filename',
    },
    {
      title: 'Table Name',
      dataIndex: 'table_name',
      key: 'table_name',
      render: (records, recordCurr) => (
        <>
          <Select
            style={{ width: '180px' }}
            onChange={(tbName) => {
              handleTableChange(recordCurr, tbName);
            }}
            loading={bulkImports.getTables.loading || loading}
            showSearch
            value={recordCurr.table_name}
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children?.toLowerCase()?.localeCompare(optionB.children?.toLowerCase())
            }
          >
            {bulkImports.getTables.data?.map((option: IDatabaseTable, index: number) => (
              <Option key={index} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </>
      ),
    },
    {
      title: 'Tab',
      dataIndex: 'sheet',
      key: 'sheet',
    },
    {
      title: 'Header Row',
      dataIndex: 'header_row',
      key: 'header_row',
    },
    {
      title: 'Saved Mapping',
      dataIndex: 'show_mapping',
      key: 'show_mapping',
      render: (record, selectedRecord) => (
        <>
          <TreeSelect
            style={{ width: '200px' }}
            dropdownClassName="value-box-select"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={getMenuDropdown(selectedRecord.show_mapping, selectedRecord)}
            value={selectedRecord.currentMapping}
            onChange={(e) => onChange(selectedRecord, e)}
            treeDefaultExpandAll
            allowClear
            showSearch
          />
        </>
      ),
    },
    {
      title: 'Date Added',
      dataIndex: 'date',
      key: 'date',
      render: (data, selectedData) => (
        <>
          <DatePicker
            style={{ width: '130px' }}
            value={moment(selectedData.date)}
            className="form-control"
            onChange={(e) => onDateChange(selectedData, e)}
            placeholder="Select Date Added"
          />
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'key',
      key: 'key',
      render: (record, selectedRecord) => (
        <>
          <Button
            type="primary"
            style={{ margin: '0 5px 5px 0px' }}
            onClick={() => {
              setSelectedRowId(selectedRecord.index);
              setHeaderRowCount(selectedRecord.header_row);
              setShowManageExcel(true);
            }}
          >
            Manage Header
          </Button>

          <Button
            type="primary"
            onClick={() => {
              deleteSelected(selectedRecord.index, selectedRecord.filename);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        showHeader={true}
        pagination={false}
        scroll={{ x: true }}
        dataSource={hideUnmapped === false ? withoutUnmappedRecords : records}
        rowKey={(record) => record['index']}
        columns={columns}
        loading={records.length == 0}
        expandable={{
          onExpandedRowsChange: (record) => {
            setExpandedRecords(record);
          },
          expandedRowRender: (record) => (
            <MappingColumn
              setRecords={setRecords}
              record={record}
              count={count}
              records={records}
              flagForMappingHighlights={flagForMappingHighlights}
              setFlagForMappingHighlights={setFlagForMappingHighlights}
              skipRows={record?.header_row > 0 ? record?.header_row - 1 : 0}
              fileName={
                record?.key_word === null
                  ? record?.original_filename.split('.')[0]
                  : record?.key_word
              }
              fileType={record?.original_filename.slice(
                ((record?.original_filename.lastIndexOf('.') - 1) >>> 0) + 2
              )}
              is_public={record.is_public}
              tableName={record?.table_name}
              seqNumber={record?.index}
              dateChangeFlag={dateChangeFlag}
              setDateChangeFlag={setDateChangeFlag}
            ></MappingColumn>
          ),
        }}
      />
      {/* <tr>
        <td>{fileData.original_filename}</td>
        <td>
          <Select
            onChange={handleTableChange}
            loading={bulkImports.getTables.loading}
            showSearch
            defaultValue={table}
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
        </td>
        <td>{innerFormUpload.getFieldValue('sheet_name')}</td>
        <td>{innerFormUpload.getFieldValue('header_row') == null ? 1 : innerFormUpload.getFieldValue('header_row')}  </td>
        <td>{<Button
          type="primary"
          onClick={() => {
            setShowManageExcel(true);
          }}
        >
          Manage Excel
        </Button>}
        </td>
        <td>{<Button
          type="primary"
          onClick={() => {
            setShowMappingModal(true);
          }}
        >
          Manage Mapping
        </Button>}
        </td>
      </tr> */}

      <div className="update-excel-page">
        {/*<div className="main-card">
          
           <div className="input-btns-title">
            <Form 
              form={innerFormUpload}
              name="innerFormUpload"
            >
              <Row gutter={[30, 20]} className="align-item-start">
                <Col xs={24} md={6}>
                  <div className="form-group m-0">
                    <label className="label">File Name</label>
                    <Form.Item name="original_filename" className="m-0">
                      <Input disabled={true} className="form-control w-100" />
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="form-group m-0">
                    <label className="label">Table Name</label>
                    <Form.Item name={'table_name'} className="m-0">
                      <Select
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
                {bulkImports.getExcelColumns.data?.length > 0 &&
                  bulkImports.getExcelColumns.data[selectedRowId - 1]?.excel_sheet_columns && (
                    <Col xs={24} md={6}>
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
                            {bulkImports.getExcelColumns.data?.length > 0 &&
                              bulkImports.getExcelColumns.data[
                                seqNumber - 1
                              ]?.excel_sheet_columns.map(
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
                {bulkImports.getExcelColumns.data?.length > 0 &&
                  bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns && (
                    <Col xs={24} md={6}>
                      <div className="form-group m-0">
                        <label className="label">Header Row</label>
                        <Form.Item name="header_row" className="m-0" rules={[{ type: 'integer' }]}>
                          <InputNumber
                            min={1}
                            className="form-control w-100"
                            onChange={setFormFields}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                {innerFormUpload?.getFieldValue('table_name') &&
                  fileData?.original_filename &&
                  bulkImports.getExcelColumns.data?.length > 0 &&
                  bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns && (
                    <Col xs={24} md={6}>
                      <div className="form-group m-0">
                        <label className="label">Saved Mapping</label>
                        <Form.Item name="mapping_order" className="m-0">
                          <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={getMenuDropdown()}
                            placeholder="Default: Select"
                            onChange={onChange}
                            treeDefaultExpandAll
                            allowClear
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                 {bulkImports.getExcelColumns.data?.length > 0 &&
                  bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns && (
                    <Col xs={24} md={6}>
                      <div className="form-group m-0">
                        <label className="label"></label>
                        <div className="bottom-fix">
                          <Button
                            type="primary"
                            className="w-100"
                            onClick={() => {
                              setShowManageExcel(true);
                            }}
                          >
                            Manage Excel
                          </Button>
                        </div>
                      </div>
                    </Col>
                  )} 
              </Row>
            </Form>
          </div> */}
        {/* {loadingTableColumns && (
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
              !loadingTableColumns &&
              tableColumns &&
              tableColumns.length > 0 &&
              excelColumns && (
                <>
                  {removedColumns && removedColumns.length > 0 && (
                    <Row gutter={[30, 0]} className="form-label-hide input-btns-title">
                      {removedColumns.some((x) => x.name?.toLowerCase() === 'tenantid') && (
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
                                    tableColumnState.find(
                                      (x) => x.name?.toLowerCase() === 'tenantid'
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
                      {removedColumns.some((x) => x.name?.toLowerCase() === 'companyid') && (
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
                                    tableColumnState.find(
                                      (x) => x.name?.toLowerCase() === 'companyid'
                                    )?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
                            >
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
                              >
                                {compBuLookups.compony.map((option: ILookup) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                      {removedColumns.some((x) => x.name?.toLowerCase() === 'bu_id') && (
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
                                    tableColumnState.find((x) => x.name?.toLowerCase() === 'bu_id')
                                      ?.is_nullable === 'NO'
                                      ? true
                                      : false,
                                },
                              ]}
                            >
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
                              >
                                {compBuLookups.bu.map((option: ILookup) => (
                                  <Option key={option.id} value={option.id}>
                                    {option.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </Col>
                      )}
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
                                    tableColumnState.find((x) => x.name === 'Date Added')
                                      ?.is_nullable === 'NO'
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
                      onClick={() => {
                        innerFormUpload.getFieldValue('mapping_order')
                          ? forSaveMapping()
                          : setShowMappingModal(true);
                      }}
                      loading={bulkImports.saveExcelFileMapping.loading}
                    >
                      Save Mapping
                    </Button>
                  </div>
                </>
              )}
          </Form>
        </div> */}
      </div>
      {showManageExcel && (
        <PreviewExcel
          showModal={showManageExcel}
          maxCount={maxHeaderRow}
          maxColumn={maxColumn}
          handleModalClose={() => {
            setShowManageExcel(false);
          }}
          setFlagForMappingHighlights={setFlagForMappingHighlights}
          dataRecords={records}
          setRecords={setRecords}
          setDelimitFlag={setDelimitFlag}
          seqNumber={selectedRowId}
          previewData={previewData}
          records={excelPreviewData}
          setExcelPreviewData={setExcelPreviewData}
          headerRowCount={headerRowCount}
          firstFlag={firstFlag}
          setFirstFlag={setFirstFlag}
        />
      )}
    </>
  );
};

export default RenderBI;
