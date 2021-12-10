import { Button, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import { IInlineSearch } from '../../../common/models/common';
import commonService from '../../../services/common/common.service';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { bulkImportSelector } from '../../../store/bulkImport/bulkImport.reducer';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import { IMappingColumnProps } from './MappingColumn.model';
import _ from 'lodash';
import moment from 'moment';
import { saveExcelFileMapping } from '../../../store/bulkImport/bulkImport.action';
import { ISaveExcelMapping } from '../../../services/bulkImport/bulkImport.model';

const { Option } = Select;

const MappingColumn: React.FC<IMappingColumnProps> = (props) => {
  const { record , skipRows, fileName, fileType, seqNumber , records , setRecords } = props;

  const [form] = Form.useForm();
  const initialValues = {
    file_name: fileName,
    file_type: fileType,
    isPublic: false,
  };
  const globalFilters = useAppSelector(globalSearchSelector);
  const bulkImports = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();

  const [tableColumnState, setTableColumnState] = useState<any>([]);
  const [excelColumns, setExcelColumns] = useState(null);
  const [loadingTableColumns, setLoadingTableColumns] = useState<boolean>(false);

  useEffect(() => {
    if (record.table_name) {
      setLoadingTableColumns(true);
      commonService.getTableColumns(record.table_name).then((res) => {
        if (res) {
          const response: any = res;
          const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
          let filterExcelColumns: any = bulkImports.getExcelColumns.data[
            seqNumber - 1
          ]?.excel_sheet_columns.find((e) => e.sheet === record.sheet).columns;
          const filterTableColumns = response?.filter(
            (x) => !columnsArray.includes(x.name?.toLowerCase())
          );
          if (filterExcelColumns?.length >= skipRows) {
            filterExcelColumns = filterExcelColumns[skipRows];
          }
          const ExcelColsSorted = [...filterExcelColumns];
          ExcelColsSorted.sort();
          setExcelColumns(ExcelColsSorted);
          setTableColumnState(filterTableColumns);

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
        }
      setLoadingTableColumns(false);   
      });        
    }else {
        setTableColumnState([]);
        setTableColumnState([]);
      }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ file_name: fileName });
    form.setFieldsValue({ file_type: fileType });
  }, [fileName]);

  const saveColumnMapping = (filename: string, filetype ,isPublic: boolean, id = 0) => {
    const parentId = record.show_mapping?.find((x) =>
      x.config_excel_column_mappings?.find((y) => y.id === id)
    )?.id;
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.file_name;
    delete fieldValues.file_type;
    delete fieldValues.is_public;
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
    const excelMappingObj: ISaveExcelMapping = {
      id: parentId,
      table_name: record.table_name,
      file_type: filetype,
      key_word: filename,
      is_public: isPublic,
      config_excel_column_mappings: [
        {
          sheet_name: record.sheet,
          header_row: skipRows,
          mapping: JSON.stringify(sqlToExcelMapping),
        },
      ],
    };

    dispatch(saveExcelFileMapping(excelMappingObj));
  };

  const onFinish = (values: any) => {
    const { file_name, file_type , isPublic, ...rest } = values;

    saveColumnMapping(file_name, file_type , isPublic);
  };

  const setMappingRecords = () => {
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.file_name;
    delete fieldValues.file_type;
    delete fieldValues.is_public;
    const sqlToExcelMapping = [];
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (key && value) {
          sqlToExcelMapping.push({
            key: `${key}`,
            value: `${value}`,
          });
        }
    });
    const dummyrecords = [...records];
    dummyrecords[seqNumber-1].excel_to_sql_mapping = sqlToExcelMapping;
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
              <Form.Item
                name="file_type"
                label="File Type"
                className="m-0"
              >
                <Input className="form-control" disabled={true} />
              </Form.Item>
            </div>
          </Col>
          <Can I={Action.Select} a={Page.ConfigExcelFileMapping}>
            {}
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
        <br/>
        <hr/>
        {loadingTableColumns ? (
          <div className="spin-loader">
            <Spin spinning={true} />
          </div>
        ) :   (<Row gutter={[30, 15]} className="form-label-hide">
                {(tableColumnState || []).map((col, index: number) => (
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
                          onChange={setMappingRecords}
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
              </Row>)}
      </Form>
      <br />
      <div className="btns-block modal-footer">
        <Button
          key="submit"
          type="primary"
          onClick={() => {
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
