import { Button, Col, Form, InputNumber, Modal, Popconfirm, Row, Select, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/common';
import { IPreviewExcel } from './PreviewExcel.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { getCSVExcelColumns } from '../../../store/bulkImport/bulkImport.action';
import {
  bulkImportSelector,
  clearCSVExcelColumns,
} from '../../../store/bulkImport/bulkImport.reducer';
import { toast } from 'react-toastify';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const PreviewExcel: React.FC<IPreviewExcel> = (props) => {
  const {
    headerRowCount,
    dataRecords,
    setRecords,
    previewData,
    setDelimitFlag,
    records,
    showModal,
    handleModalClose,
    maxCount,
    maxColumn,
    seqNumber,
    firstFlag,
    setFirstFlag,
    setExcelPreviewData,
    setFlagForMappingHighlights,
  } = props;

  const [columns, setColumns] = useState([]);
  const dispatch = useAppDispatch();
  const [showDelimiter, setShowDelimiter] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [disableHeaderRow, setDisableHeaderRow] = useState(false);
  const bulkImport = useAppSelector(bulkImportSelector);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });
  const globalLookups = useAppSelector(globalSearchSelector);

  const checkDelimiter = () => {
    setDelimitFlag(false);
    setFirstFlag(true);
    const dummyRecord = dataRecords.filter((data) => data.index == seqNumber)[0];
    const arr = [
      {
        original_filename: dummyRecord.original_filename,
        filename: dummyRecord.filename,
        delimiter: form.getFieldValue('deli_meter'),
      },
    ];
    const global_dd = {
      tenant_id: globalLookups.search.tenant_id ? globalLookups.search.tenant_id : null,
      company_id: globalLookups.search.company_id ? globalLookups.search.company_id : null,
      bu_id: globalLookups.search.bu_id ? globalLookups.search.bu_id : null,
    };
    const Obj = { csv_file_info: arr, global_dd };
    dispatch(getCSVExcelColumns(Obj));
  };

  useEffect(() => {
    if (firstFlag) {
      if (
        bulkImport.getCSVExcelColumns.csvFiles !== null &&
        bulkImport.getCSVExcelColumns.csvFiles?.length > 0
      ) {
        toast.warn('Please re-check your Delimiter');
      }
      if (
        bulkImport.getCSVExcelColumns.csvFiles !== null &&
        bulkImport.getCSVExcelColumns.csvFiles?.length == 0
      ) {
        toast.success('Your Delimiter is On Mark!');
        previewData(true, form.getFieldValue('header_row'));
      }
    }
  }, [bulkImport.getCSVExcelColumns.csvFiles]);

  useEffect(() => {
    const dummyRecord = dataRecords?.filter((data) => data.index === seqNumber);
    showModal && previewData(false, headerRowCount);
    if ((dummyRecord[0].is_dynamic_header)) {
      setTimeout(() => {
        addDummyHeader();
      }, 2000);
    }
  }, [showModal]);

  const [form] = Form.useForm();
  const initialValues = {
    header_row: headerRowCount,
    no_header: dataRecords.filter((data) => data.index == seqNumber).length > 0 &&
      dataRecords.filter((data) => data.index == seqNumber)[0].is_dynamic_header == true ? true : false,
    deli_meter:
      dataRecords.filter((data) => data.index == seqNumber).length > 0 &&
        dataRecords.filter((data) => data.index == seqNumber)[0].delimiter !== null
        ? dataRecords.filter((data) => data.index == seqNumber)[0].delimiter
        : ',',
  };

  useEffect(() => {
    dataRecords.map((data) => {
      if (data.index == seqNumber) {
        data.original_filename.slice(((data?.original_filename.lastIndexOf('.') - 1) >>> 0) + 2) ==
          'csv' ||
          data.original_filename.slice(((data?.original_filename.lastIndexOf('.') - 1) >>> 0) + 2) ==
          'txt'
          ? setShowDelimiter(true)
          : setShowDelimiter(false);
        if (data.is_dynamic_header) {
          setDisableHeaderRow(true);
          setTimeout(() => {
            addDummyHeader();
          }, 1000);
        }
      }
    });
    const initialValues = {
      header_row: headerRowCount,
    };
    form.setFieldsValue(initialValues);
    return () => {
      dispatch(clearCSVExcelColumns());
      setDelimitFlag(true);
      setFirstFlag(false);
    };
  }, []);

  useEffect(() => {
    const mainColumns = [];
    if (records?.length > 0) {
      const dummyRecord = dataRecords?.filter((data) => data.index == seqNumber);
      if(dummyRecord && dummyRecord[0].is_dynamic_header && !(records[0][0].includes('Column')))
      addDummyHeader();
      setTableData(records);
      for (let index = 0; index <= maxColumn; index++) {
        mainColumns.push({
          dataIndex: 'description' + index,
          key: 'description' + index,
          ellipsis: true,
          render: (_, data: any, i) => {
            return (
              <>
                {index === 0
                  ? headerRowCount === 0
                    ? 1
                    : i + (form.getFieldValue('header_row') ?? 1)
                  : data[index - 1]}
              </>
            );
          },
        });
      }
      setColumns(mainColumns);
    }
  }, [records]);

  const handleTableChange = (paginating) => {
    setPagination(paginating);
  };

  const addDummyHeader = () => {
    if (records && records?.length && !(records[0][0].includes('Column'))) {
      setDisableHeaderRow(true);
      form.setFieldsValue({ header_row: 1 });
      const dummyRec = records[0];
      const columnHeader = [];
      for (let i = 0; i < dummyRec?.length; i++) {
        columnHeader.push(`Column-${('0' + (i + 1)).slice(-2)}`);
      }
      const rec = [columnHeader].concat(records);
      setExcelPreviewData(rec);
      setTableData(rec);
      const dummyRecords = _.cloneDeep(dataRecords);
      dummyRecords?.map((data) => {
        if (data.id == seqNumber) {
          data.columns = rec;
          data.header_row = 0;
        }
      });
      setRecords(dummyRecords);
    }
  }

  const changeHeader = (value) => {
    if (value) {
      addDummyHeader();
    } else {
      setDisableHeaderRow(false);
      records.shift();
      setExcelPreviewData(records);
      setTableData(records);
      handleTableChange(10);
      const dummyRecords = _.cloneDeep(dataRecords);
      dummyRecords?.map((data) => {
        if (data.id == seqNumber) {
          data.columns = records;
          data.header_row = 0;
        }
      });
      setRecords(dummyRecords);
    }
  };

  const submitHeaderRow = (values: any) => {
    setFlagForMappingHighlights(false);
    const dummyRecords = _.cloneDeep(dataRecords);
    dummyRecords.map((data) => {
      if (data.index == seqNumber) {
        data.header_row = values.header_row;
        data.delimiter = values.deli_meter;
        data.excel_to_sql_mapping = null;
        data.is_dynamic_header = values.no_header;
        data.currentMapping = null;
      }
    });
    setRecords(dummyRecords);
    handleModalClose();
  };


  return (
    <Modal
      wrapClassName="custom-modal"
      title={'Manage Excel'}
      centered
      visible={showModal}
      onCancel={handleModalClose}
      footer={false}
    >
      <Form form={form} name="formUpload" initialValues={initialValues} onFinish={submitHeaderRow}>
        <Row gutter={[30, 15]} className="form-label-hide">
          <Col xs={24} sm={12} md={12}>
            <div className="form-group ">
              <label className="label">Header Row</label>
              <Form.Item
                name="header_row"
                className="m-0"
                rules={[
                  {
                    required: true,
                    type: 'integer',
                    message: 'Header Row is Required and Integral',
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={maxCount}
                  disabled={disableHeaderRow}
                  className="form-control w-100"
                  onChange={(value) => {
                    previewData(false, value);
                  }}
                />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div className="form-group form-inline-pt m-0">
              <Form.Item
                name="no_header"
                className="m-0"
                valuePropName="checked"
              >
                <Switch className="form-control" onChange={(value) => { changeHeader(value); }} />
              </Form.Item>
              <label className="label">No Headers?</label>
            </div>
          </Col>
          {showDelimiter ? (
            <>
              <Col xs={24} sm={12} md={12}>
                <div className="form-group ">
                  <label className="label">Delimiter</label>
                  <Form.Item
                    name="deli_meter"
                    className="m-0"
                    rules={[{ required: true, message: 'Delimiter is Required' }]}
                  >
                    <Select
                      placeholder="Select a Delimit"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value=";">Semi Colon(;)</Option>
                      <Option value=",">Comma(,)</Option>
                      <Option value='$T'>TAB(  )</Option>
                      <Option value='#T'>TAB( UCS-2 Encoding )</Option>
                      {/* <Option value="    ">TAB</Option> */}
                      {/* <Option value=" ">SPACE</Option> */}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group ">
                  <label className="label">Click to check Delimiter</label>
                  <Button
                    type="primary"
                    loading={bulkImport.getCSVExcelColumns.loading}
                    onClick={() => {
                      checkDelimiter();
                    }}
                  >
                    Check Delimiter
                  </Button>
                </div>
              </Col>
            </>
          ) : (
            <></>
          )}
        </Row>
        <Table
          showHeader={false}
          scroll={{ x: true }}
          rowKey={(record) => JSON.stringify(record)}
          loading={bulkImport.getCSVExcelColumns.loading}
          pagination={{
            ...pagination,
            pageSizeOptions: [
              '10',
              records?.length > 10 ? '50' : '-',
              records?.length > 50 ? '100' : '-',
              records?.length > 100 ? '500' : '-',
            ],
            total: records?.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          dataSource={tableData?.length > 0 ? [...tableData] : []}
          columns={columns}
          className="custom-table first-row-header"
        />

        <div className="btns-block modal-footer">
          <Popconfirm
            title="Your mapping drop down will be over-written.Please re-check your mapping details after confirming"
            onConfirm={() => submitHeaderRow(form.getFieldsValue())}
          >
            <Button key="submit" type="primary" htmlType="submit">
              Ok
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </Modal>
  );
};

export default PreviewExcel;
