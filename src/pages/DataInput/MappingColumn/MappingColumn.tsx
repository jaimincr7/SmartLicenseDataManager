import { Button, Col, Form, Input, Row, Select, Spin, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import commonService from '../../../services/common/common.service';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { IMappingColumnProps } from './MappingColumn.model';
import _ from 'lodash';
import { saveExcelFileMapping } from '../../../store/bulkImport/bulkImport.action';
import { ISaveExcelMapping } from '../../../services/bulkImport/bulkImport.model';
import {
  bulkImportSelector,
  clearSaveExcelData,
} from '../../../store/bulkImport/bulkImport.reducer';
import { toast } from 'react-toastify';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;


const MappingColumn: React.FC<IMappingColumnProps> = (props) => {
  const { record, skipRows, fileName, fileType, seqNumber, records, setRecords, count, is_public, dateChangeFlag, setDateChangeFlag, setFlagForMappingHighlights } =
    props;

  const [form] = Form.useForm();
  const initialValues = {
    file_name: fileName,
    file_type: fileType,
    isPublic: is_public ? is_public : false,
  };
  const dispatch = useAppDispatch();
  const bulkImport = useAppSelector(bulkImportSelector);
  const globalLookups = useAppSelector(globalSearchSelector);

  const [tableColumnState, setTableColumnState] = useState<any>([]);
  const [excelColumns, setExcelColumns] = useState(null);
  const [loadingTableColumns, setLoadingTableColumns] = useState<boolean>(false);
  const [mappingSeq, setMappingSeq] = useState(null);
  const [tableColumns, setTableColumns] = useState(null);
  const [localMapping, setLocalMapping] = useState<boolean>(true);

  useEffect(() => {
    if (
      !bulkImport.saveExcelFileMapping.hasErrors &&
      bulkImport.saveExcelFileMapping.data !== null
    ) {
      const dummyrecords = _.cloneDeep(records);
      dummyrecords.map((data) => {
        if (data.index == record.index) {
          data.currentMapping =
            bulkImport.saveExcelFileMapping.data && bulkImport.saveExcelFileMapping.data !== null
              ? bulkImport.saveExcelFileMapping.data?.config_excel_column_mappings[0]?.sheet_name +
              '!' +
              bulkImport.saveExcelFileMapping.data?.config_excel_column_mappings[0]?.id
              : null;
          data.show_mapping = [...data.show_mapping, bulkImport.saveExcelFileMapping.data];
        }
      });
      setRecords(dummyrecords);
    }
    dispatch(clearSaveExcelData());
  }, [bulkImport.saveExcelFileMapping.data]);

  useEffect(() => {
    const dataMapRecord = records.filter((x) => x.index == seqNumber);
    if (localMapping && dateChangeFlag && !(count.save > 0)) {
      if (dataMapRecord && dataMapRecord?.length && dataMapRecord[0].table_name) {
        setLoadingTableColumns(true);
        commonService.getTableColumns(record.table_name).then((res) => {
          if (res) {
            form.resetFields();
            const response: any = res;
            const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
            let filterExcelColumns: any = record.columns;
            const filterTableColumns = response?.filter(
              (x) => !columnsArray.includes(x.name?.toLowerCase())
            );
            let tableColumnLocal = filterTableColumns;
            setTableColumns(filterTableColumns);
            if (filterExcelColumns?.length >= skipRows) {
              filterExcelColumns = filterExcelColumns[skipRows];
            }
            const ExcelColsSorted = [...filterExcelColumns];
            ExcelColsSorted.sort();
            if (dataMapRecord[0].is_dynamic_header !== true)
              setExcelColumns(ExcelColsSorted);
            setTableColumnState(filterTableColumns);
            const dummyDatas = _.cloneDeep(records);

            const initialValuesData: any = {};
            const sqlToExcelMapping = [];
            filterTableColumns.map(function (ele) {
              const latest = [];
              const mapRecord = dummyDatas.filter((x) => x.index == seqNumber);
              if (mapRecord && mapRecord.length) {
                mapRecord[0].excel_to_sql_mapping?.map((data) => {
                  if (filterExcelColumns?.includes(data.value) || mapRecord[0].is_dynamic_header) {
                    latest.push(data);
                    initialValuesData[data.key] = data.value;
                  } else {
                    const dummyTableColumn = _.cloneDeep(tableColumnLocal);
                    dummyTableColumn?.map((data1) => {
                      if (data1.name == data.key && mapRecord[0]?.currentMapping)
                        data1.validateStatus = "warning";
                    });
                    tableColumnLocal = dummyTableColumn;
                    setTableColumnState(dummyTableColumn);
                  }
                });
                if (mapRecord[0].is_dynamic_header)
                  form.setFieldsValue(initialValuesData);
                //mapRecord[0].excel_to_sql_mapping = latest;
                //latest = [];
              }
              if (dataMapRecord[0].is_dynamic_header !== true) {
                initialValuesData[ele.name] =
                  filterExcelColumns?.filter(
                    (x: any) =>
                      x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                      ele.name?.toLowerCase()?.replace(/\s/g, '')
                  ).length > 0 && latest == null
                    ? filterExcelColumns.filter(
                      (x: any) =>
                        x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                        ele.name?.toLowerCase()?.replace(/\s/g, '')
                    )[0]
                    : (latest || []).filter((data) => {
                      return (data.key == ele.name);
                    })[0]?.value;

                sqlToExcelMapping.push({
                  key: `${ele.name}`,
                  value:
                    initialValuesData[ele.name] == undefined ? '' : `${initialValuesData[ele.name]}`,
                });
              } else {
                const dummyHeader = [];
                for (let i = 0; i < ExcelColsSorted?.length; i++) {
                  dummyHeader.push(`Column-${('0' + (i + 1)).slice(-2)}`);
                }
                setExcelColumns(dummyHeader);
              }
            });
            const mapRecord = dummyDatas.filter((x) => x.index == seqNumber);
            if (mapRecord[0].is_dynamic_header !== true) {
              Object.entries(initialValuesData).forEach(([key, value]) => {
                if (value === undefined && !(filterExcelColumns?.includes(value))) {
                  const dummyTableColumn = _.cloneDeep(tableColumnLocal);
                  dummyTableColumn?.map((data) => {
                    if (data.name == key && data.validateStatus !== "warning" && mapRecord && mapRecord.length && mapRecord[0].currentMapping)
                      data.validateStatus = "success";
                  });
                  tableColumnLocal = dummyTableColumn;
                  setTableColumnState(dummyTableColumn);
                  initialValuesData[key] = filterExcelColumns.filter(
                    (x: any) =>
                      x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                      key?.toLowerCase()?.replace(/\s/g, '')
                  )[0];
                }
              });
            }
            form.setFieldsValue(initialValuesData);
            const tempRecord = records.filter((data) => data.index == seqNumber);

            if (tempRecord[0]?.excel_to_sql_mapping == null) {
              const dummyrecords = _.cloneDeep(records);
              dummyrecords.map((data) => {
                if (data.index == seqNumber) {
                  data.excel_to_sql_mapping = sqlToExcelMapping;
                }
              });
              setRecords(dummyrecords);
            }
            if (dataMapRecord[0]?.currentMapping) {
              setTimeout(() => {
                setMappingRecords();
              });
            }
          }
          setLoadingTableColumns(false);
        });
      } else {
        setTableColumnState([]);
      }
    }
    setDateChangeFlag(true);
    setLocalMapping(true);
    setFlagForMappingHighlights(true);
  }, [record.table_name, record.header_row, record.excel_to_sql_mapping]);

  useEffect(() => {
    return () => {
      setTableColumns(null);
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue({ file_name: fileName });
    form.setFieldsValue({ file_type: fileType });
  }, [fileName]);

  const saveColumnMapping = (filename: string, filetype, isPublic: boolean, id = 0) => {
    const parentId = record.show_mapping?.find((x) =>
      x.config_excel_column_mappings?.find((y) => y.id === id)
    )?.id;
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.file_name;
    delete fieldValues.file_type;
    delete fieldValues.isPublic;
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
      toast.warn('Select some fields.');
      return false;
    }
    const excelMappingObj: ISaveExcelMapping = {
      id: parentId,
      tenant_id: globalLookups.search.tenant_id ? globalLookups.search.tenant_id : null,
      company_id: globalLookups.search.company_id ? globalLookups.search.company_id : null,
      bu_id: globalLookups.search.bu_id ? globalLookups.search.bu_id : null,
      file_type: filetype,
      key_word: filename,
      is_public: isPublic,
      delimiter: record.delimiter,
      config_excel_column_mappings: [
        {
          sheet_name: record.sheet,
          header_row: record.header_row - 1,
          is_dynamic_header: record.is_dynamic_header === true ? true : false,
          table_name: record.table_name,
          mapping: JSON.stringify(sqlToExcelMapping),
        },
      ],
    };

    const currentRec = records.filter((data) => data.index == seqNumber);
    if (currentRec && currentRec?.length && currentRec[0]?.validation) {
      toast.warn('Please check required Fields once');
    } else {
      dispatch(saveExcelFileMapping(excelMappingObj));
    }
  };

  const onFinish = (values: any) => {
    const { file_name, file_type, isPublic } = values;

    saveColumnMapping(file_name, file_type, isPublic);
  };

  const setMappingRecords = () => {
    let validation = false;
    setLocalMapping(false);
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.file_name;
    delete fieldValues.file_type;
    delete fieldValues.isPublic;
    delete fieldValues.date_added;
    const sqlToExcelMapping = [];
    Object.entries(fieldValues).forEach(([key, value]) => {
      sqlToExcelMapping.push({
        key: `${key}`,
        value: value === undefined ? '' : `${value}`,
      });
    });
    tableColumns?.map((ele) => {
      const name = sqlToExcelMapping.filter(
        (data) => data.key.toLowerCase() == ele.name.toLowerCase()
      )[0];
      if (ele.is_nullable == 'NO' && name?.value == '') {
        validation = true;
      }
    });
    const dummyrecords = [...records];
    dummyrecords.map((data) => {
      if (data.index == seqNumber) {
        data.excel_to_sql_mapping = sqlToExcelMapping;
        data.validation = validation;
      }
    });
    setRecords(dummyrecords);
  };

  return (
    <>
      <Form form={form} name="saveMapping" initialValues={initialValues}>
        <Row gutter={[30, 15]} className="form-label-hide">
          <Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">Mapping Pattern</label>
              <Form.Item
                name="file_name"
                label="File Name"
                className="m-0"
                rules={[{ required: true, message: 'Please input File Name' }]}
              >
                <Input className="form-control" />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">File Type</label>
              <Form.Item name="file_type" label="File Type" className="m-0">
                <Input className="form-control" disabled={true} />
              </Form.Item>
            </div>
          </Col>
          {/*<Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">Date Added</label>
               <Form.Item name="date_added" label="Date Added" className="m-0">
                <DatePicker
                  className="form-control"
                  onChange={onDateChange}
                  placeholder="Select Date Added"
                />
              </Form.Item> 
            </div>
          </Col>*/}
          <Can I={Action.Select} a={Page.ConfigExcelFileMapping}>
            { }
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="isPublic" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Is Public?</label>
              </div>
            </Col>
          </Can>
        </Row>
        <br />
        <hr />
        <br />
        {loadingTableColumns ? (
          <div className="spin-loader">
            <Spin spinning={true} />
          </div>
        ) : (
          <Row gutter={[30, 15]} className="form-label-hide">
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
            {(tableColumnState || []).map((col, index: number) => (
              <Col xs={24} md={12} lg={12} xl={8} key={index}>
                <div className="form-group form-inline">
                  <label className="label">
                    {col.name}
                    {col.is_nullable == 'NO' ? <span style={{ color: 'red' }}> *</span> : ''}
                  </label>
                  <Form.Item
                    name={col.name}
                    style={{ border: col.validateStatus == 'success' ? '1px solid rgb(0,180,0)' : '' }}
                    label={col.name}
                    validateStatus={col.validateStatus}
                    rules={[{ required: col.is_nullable === 'NO' ? true : false }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      onChange={setMappingRecords}
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
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
        )}
      </Form>
      <br />
      <div className="btns-block modal-footer">
        <Button
          key="submit"
          type="primary"
          loading={bulkImport.saveExcelFileMapping.loading && record.index == mappingSeq}
          onClick={() => {
            setMappingSeq(seqNumber);
            onFinish(form.getFieldsValue());
          }}
        >
          Save Mapping
        </Button>
      </div>
    </>
    //</Modal>
  );
};

export default MappingColumn;
