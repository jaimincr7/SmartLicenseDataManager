import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  TreeSelect,
} from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  getTables,
  getTablesForImport,
  saveExcelFileMapping,
} from '../../../store/bulkImport/bulkImport.action';
import {
  clearExcelColumns,
  bulkImportSelector,
} from '../../../store/bulkImport/bulkImport.reducer';
import {
  IBulkInsertDataset,
  IDatabaseTable,
  IExcelSheetColumn,
  ILookup,
} from '../../../services/common/common.model';
import { validateMessages } from '../../../common/constants/common';
import { commonSelector } from '../../../store/common/common.reducer';
import { getTenantLookup } from '../../../store/common/common.action';
import moment from 'moment';
import PreviewExcel from '../PreviewExcelFile/previewExcelFile';
import { ISaveExcelMapping } from '../../../services/bulkImport/bulkImport.model';
import MappingColumn from './../MappingColumn/MappingColumn';
import { IRenderBIProps } from './renderBI.model';
import _ from 'lodash';
import commonService from '../../../services/common/common.service';
import bulkImportService from '../../../services/bulkImport/bulkImport.service';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../common/models/common';

const { Option } = Select;

let maxHeaderRow = 1;

const RenderBI: React.FC<IRenderBIProps> = (props) => {
  const { seqNumber, fileData, count, handleSave, table } = props;
  const bulkImports = useAppSelector(bulkImportSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const [form] = Form.useForm();
  const [innerFormUpload] = Form.useForm();

  const [excelColumns, setExcelColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState(null);
  const [removedColumns, setRemovedColumns] = useState(null);
  const [excelPreviewData, setExcelPreviewData] = useState<any>();
  const [showManageExcel, setShowManageExcel] = useState<boolean>(false);
  const [showMappingModal, setShowMappingModal] = useState<boolean>(false);
  const [tableColumnState, setTableColumnState] = useState<any>([]);
  const [savedExcelMapping, setSavedExcelMapping] = useState<any>([]);
  const [loadingTableColumns, setLoadingTableColumns] = useState<boolean>(false);
  const [compBuLookups, setCompBuLookups] = useState<{ [key: string]: any }>({
    compony: [],
    bu: [],
  });

  const handleTableChange = (tableName: string) => {
    if (tableName) {
      setLoadingTableColumns(true);
      commonService.getTableColumns(tableName).then((res) => {
        if (res) {
          setTableColumnState(res);
        }
        setLoadingTableColumns(false);
      });
    } else {
      setTableColumnState([]);
      setTableColumnState([]);
    }
  };

  const handleSheetChange = () => {
    setFormFields();
  };

  useEffect(() => {
    if (fileData?.original_filename) {
      innerFormUpload?.setFieldsValue({ original_filename: fileData?.original_filename });
    }
  }, [fileData?.original_filename]);

  useEffect(() => {
    if (count.save > 0) {
      form.submit();
    }
  }, [count.save]);

  useEffect(() => {
    if (count.reset > 0) {
      resetPage();
    }
  }, [count.reset]);

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
    const uploadValue = innerFormUpload.getFieldsValue();
    const inputValues: IBulkInsertDataset = {
      excel_to_sql_mapping: sqlToExcelMapping,
      header_row: Number(innerFormUpload.getFieldValue('header_row')) - 1 ?? 0,
      file_name: bulkImports.getExcelColumns.data[seqNumber - 1].filename,
      table_name: uploadValue?.table_name,
      sheet_name: uploadValue?.sheet_name,
      foreign_key_values: {
        tenant_id: tenant_id,
        bu_id: bu_id,
        company_id: company_id,
        date_added: date_added,
      },
    };
    handleSave(inputValues);
  };

  const formUploadInitialValues = {
    header_row: 1,
    original_filename: fileData?.original_filename,
  };

  const setFormFields = async () => {
    const skipRows =
      Number(innerFormUpload.getFieldValue('header_row')) > 0
        ? Number(innerFormUpload.getFieldValue('header_row')) - 1
        : 0;
    let currentSheetName = innerFormUpload.getFieldValue('sheet_name');
    if (
      !currentSheetName &&
      bulkImports.getExcelColumns.data?.length > 0 &&
      bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns
    ) {
      currentSheetName =
        bulkImports.getExcelColumns.data[seqNumber - 1].excel_sheet_columns[0].sheet;
      innerFormUpload.setFieldsValue({ sheet_name: currentSheetName });
    }
    if (
      tableColumnState &&
      bulkImports.getExcelColumns.data?.length > 0 &&
      bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns
    ) {
      const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
      let filterExcelColumns: any = bulkImports.getExcelColumns.data[
        seqNumber - 1
      ]?.excel_sheet_columns.find((e) => e.sheet === currentSheetName).columns;
      const filterTableColumns = tableColumnState.filter(
        (x) => !columnsArray.includes(x.name?.toLowerCase())
      );
      if (filterExcelColumns?.length >= skipRows) {
        filterExcelColumns = filterExcelColumns[skipRows];
      }
      const removedColumns = tableColumnState.filter((x) =>
        columnsArray.includes(x.name?.toLowerCase())
      );

      setExcelColumns(filterExcelColumns);
      setTableColumns(filterTableColumns);
      setRemovedColumns(removedColumns);

      removedColumns.some((x) => x.name?.toLowerCase() === 'tenantid') &&
        dispatch(getTenantLookup());

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
        date_added: moment(),
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
      setExcelColumns(null);
      setTableColumns(null);
    }
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      commonService.getCompanyLookup(tenantId).then((res) => {
        setCompBuLookups({ compony: res.body?.data, bu: [] });
      });
    } else {
      setCompBuLookups({ compony: [], bu: [] });
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      commonService.getBULookup(companyId).then((res) => {
        setCompBuLookups({ ...compBuLookups, bu: res.body?.data });
      });
    } else {
      setCompBuLookups({ ...compBuLookups, bu: [] });
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
    setTableColumnState([]);
    dispatch(clearExcelColumns());
    innerFormUpload.resetFields(['upload_file', 'sheet_name', 'header_row']);
    setExcelColumns(null);
    setTableColumns(null);
  };

  useEffect(() => {
    if (bulkImports.getExcelColumns.data?.length > 0) {
      setFormFields();
      maxHeaderRow = bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns?.find(
        (e) => e.sheet === innerFormUpload.getFieldValue('sheet_name')
      )?.columns?.length;
    }
  }, [tableColumnState, bulkImports.getExcelColumns.data]);

  useEffect(() => {
    if (!(bulkImports.getTables.data && bulkImports.getTables.data.length > 0)) {
      dispatch(getTables());
    }
    if (!table) {
      dispatch(getTablesForImport());
    }
  }, [dispatch]);

  useEffect(() => {
    if (table) {
      const currentTable = bulkImports.getTables.data.filter(
        (t) => t.name.toLowerCase() === (table || '').toLowerCase()
      );
      if (currentTable.length > 0) {
        innerFormUpload.setFieldsValue({ table_name: currentTable[0].name });
        setLoadingTableColumns(true);
        commonService.getTableColumns(currentTable[0].name).then((res) => {
          if (res) {
            setTableColumnState(res);
          }
          setLoadingTableColumns(false);
        });
      }
    }
  }, [bulkImports.getTables.data, table]);

  useEffect(() => {
    if (!table && innerFormUpload?.getFieldValue('table_name')) {
      innerFormUpload?.setFieldsValue({ table_name: undefined });
      setTableColumnState([]);
      innerFormUpload.resetFields(['upload_file', 'sheet_name', 'header_row']);
      setExcelColumns(null);
      setTableColumns(null);
    }
  }, [table]);

  const previewData = (headerValue = 0) => {
    const currentExcelData = [
      ...bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns?.find(
        (x) => x.sheet === innerFormUpload?.getFieldValue('sheet_name')
      )?.columns,
    ];
    currentExcelData?.splice(0, headerValue - 1 > 0 ? headerValue - 1 : 0);
    setExcelPreviewData(currentExcelData);
    innerFormUpload.setFieldsValue({ header_row: headerValue });
    setFormFields();
  };
  // End: set tables for import

  useEffect(() => {
    if (globalFilters) {
      setCompBuLookups({
        compony: globalFilters.globalCompanyLookup?.data,
        bu: globalFilters.globalBULookup?.data,
      });
    }
    return () => {
      setTableColumnState([]);
    };
  }, []);

  const geChildDropdown = (excelMappings: any) => {
    const chidDropdown = [];
    excelMappings?.map((m: any) => {
      chidDropdown.push({
        title: m.sheet_name,
        value: m.id,
      });
    });

    return chidDropdown;
  };

  const getMenuDropdown = () => {
    const dropdown = [];
    const defaultMappingDetail = savedExcelMapping?.filter(
      (x) => x.table_name === innerFormUpload?.getFieldValue('table_name')
    );
    defaultMappingDetail?.map((m: any) => {
      dropdown.push({
        title: m.key_word,
        disabled: true,
        value: `${m.id}-parent`,
        children: geChildDropdown(m.config_excel_column_mappings),
      });
    });
    if (dropdown?.length === 0) {
      innerFormUpload.setFieldsValue({ mapping_order: undefined });
    }
    return dropdown;
  };

  const getExcelMappingColumns = () => {
    if (innerFormUpload?.getFieldValue('table_name') && fileData?.original_filename) {
      bulkImportService
        .getExcelFileMapping({
          table_name: innerFormUpload.getFieldValue('table_name'),
          key_word: fileData?.original_filename,
        })
        .then((res) => {
          setSavedExcelMapping(res?.body?.data);
        });
    }
  };

  useEffect(() => {
    if (savedExcelMapping?.length > 0) {
      const defaultSelected = savedExcelMapping?.find((x) => x.is_select === true);
      if (defaultSelected && defaultSelected.config_excel_column_mappings?.length > 0) {
        const selectedMappingOrder = defaultSelected.config_excel_column_mappings[0]?.id;
        innerFormUpload.setFieldsValue({ mapping_order: selectedMappingOrder });
        onChange(selectedMappingOrder);
      }
    }
  }, [savedExcelMapping]);

  useEffect(() => {
    getExcelMappingColumns();
  }, [innerFormUpload?.getFieldValue('table_name')]);

  useEffect(() => {
    getExcelMappingColumns();
  }, [fileData?.original_filename]);

  const onChange = (value) => {
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
          seqNumber - 1
        ]?.excel_sheet_columns?.find(
          (e) => e.sheet === innerFormUpload?.getFieldValue('sheet_name')
        ).columns;
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

  const saveColumnMapping = (fileName: string, isPublic: boolean, id = 0) => {
    const parentId = savedExcelMapping?.find((x) =>
      x.config_excel_column_mappings?.find((y) => y.id === id)
    )?.id;
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.tenant_id;
    delete fieldValues.company_id;
    delete fieldValues.bu_id;
    delete fieldValues.date_added;
    const sqlToExcelMapping = [];
    Object.entries(fieldValues).forEach(([key, value]) => {
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
    const uploadValue = innerFormUpload.getFieldsValue();
    const excelMappingObj: ISaveExcelMapping = {
      id: parentId,
      table_name: uploadValue?.table_name,
      key_word: fileName ? fileName : bulkImports.getExcelColumns.data[seqNumber - 1].filename,
      is_public: isPublic,
      config_excel_column_mappings: [
        {
          sheet_name: uploadValue?.sheet_name,
          header_row: uploadValue?.header_row,
          mapping: JSON.stringify(sqlToExcelMapping),
        },
      ],
    };

    dispatch(saveExcelFileMapping(excelMappingObj));
    setShowMappingModal(false);
  };

  return (
    <>
      <div className="update-excel-page">
        <div className="main-card">
          <div className="input-btns-title">
            <Form
              form={innerFormUpload}
              name="innerFormUpload"
              initialValues={formUploadInitialValues}
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
                  bulkImports.getExcelColumns.data[seqNumber - 1]?.excel_sheet_columns && (
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
                            max={maxHeaderRow}
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
          </div>
          {loadingTableColumns && (
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
                      {removedColumns.some((x) => x.name?.toLowerCase() === 'date added') && (
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
                          ? saveColumnMapping(
                              fileData?.original_filename,
                              false,
                              innerFormUpload.getFieldValue('mapping_order')
                            )
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
        </div>
      </div>
      <PreviewExcel
        showModal={showManageExcel}
        maxCount={maxHeaderRow}
        handleModalClose={() => {
          setShowManageExcel(false);
          if (!innerFormUpload.getFieldValue('header_row')) {
            innerFormUpload.setFieldsValue({ header_row: 1 });
          }
        }}
        previewData={previewData}
        records={excelPreviewData}
        headerRowCount={innerFormUpload.getFieldValue('header_row')}
      ></PreviewExcel>
      {showMappingModal && (
        <MappingColumn
          handleModalClose={() => {
            setShowMappingModal(false);
          }}
          showModal={showMappingModal}
          fileName={fileData?.original_filename.split('.')[0]}
          saveMapping={(fileName, isPublic) => {
            saveColumnMapping(fileName, isPublic);
          }}
        ></MappingColumn>
      )}
    </>
  );
};

export default RenderBI;
