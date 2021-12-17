import { Button, Col, Form, InputNumber, Modal, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/common';
import { IPreviewExcel } from './PreviewExcel.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { getCSVExcelColumns } from '../../../store/bulkImport/bulkImport.action';
import { bulkImportSelector, clearCSVExcelColumns } from '../../../store/bulkImport/bulkImport.reducer';
import { toast } from 'react-toastify';

const { Option } = Select;

const PreviewExcel: React.FC<IPreviewExcel> = (props) => {
  const { headerRowCount, dataRecords, setRecords, previewData, setDelimitFlag, records, showModal, handleModalClose, maxCount, seqNumber } = props;
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [firstFlag, setFirstFlag] = useState(false);
  const dispatch = useAppDispatch();
  const [showDelimiter, setShowDelimiter] = useState(false);
  const bulkImport = useAppSelector(bulkImportSelector);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  const checkDelimiter = () => {
    setDelimitFlag(false);
    setFirstFlag(true);
    const dummyRecord = dataRecords.filter(data => data.index == seqNumber)[0];
    const arr = [
      {
        original_filename: dummyRecord.original_filename,
        filename: dummyRecord.filename,
        delimiter: form.getFieldValue('deli_meter'),
      }
    ];
    const Obj = { csv_file_info: arr };
    dispatch(getCSVExcelColumns(Obj));
  };

  useEffect(() => {
    if (firstFlag) {
      if (bulkImport.getCSVExcelColumns.csvFiles !== null && bulkImport.getCSVExcelColumns.csvFiles?.length > 0) {
        toast.warn('Please re-check your De-limiter');
      }
      if (bulkImport.getCSVExcelColumns.csvFiles !== null && bulkImport.getCSVExcelColumns.csvFiles?.length == 0) {
        toast.success('Your DeLimiter is On Mark!');
        setTableData(bulkImport.getCSVExcelColumns.data[0].excel_sheet_columns[0].columns);
      }
    }
  }, [bulkImport.getCSVExcelColumns.csvFiles]);

  useEffect(() => {
    showModal && previewData(headerRowCount);
  }, [showModal]);

  const [form] = Form.useForm();
  const initialValues = {
    header_row: headerRowCount,
    deli_meter: ','
  };

  useEffect(() => {
    dataRecords.map((data) => {
      if (data.index == seqNumber) {
        data.original_filename.slice((data?.original_filename.lastIndexOf(".") - 1 >>> 0) + 2) == 'csv' ? setShowDelimiter(true) : setShowDelimiter(false);
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
    }
  }, []);

  useEffect(() => {
    const mainColumns = [];
    if (!firstFlag ? records?.length > 0 : tableData?.length > 0) {
      for (let index = 0; index <= maxCount; index++) {
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
  }, [tableData,records]);

  const handleTableChange = (paginating) => {
    setPagination(paginating);
  };

  const submitHeaderRow = (values: any) => {
    const dummyRecords = _.cloneDeep(dataRecords);
    dummyRecords.map((data) => {
      if (data.index == seqNumber) {
        data.header_row = values.header_row;
        data.delimeter = values.deli_meter;
      }
    });
    setRecords(dummyRecords);
    handleModalClose();
  }

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
          <Col xs={24} sm={12} md={8}>
            <div className="form-group ">
              <label className="label">Header Row</label>
              <Form.Item name="header_row" className="m-0" rules={[{ required: true, type: 'integer', message: 'Header Row is Required and Integral' }]}>
                <InputNumber
                  min={1}
                  max={maxCount}
                  className="form-control w-100"
                  onChange={(value) => {
                    previewData(value);
                  }}
                />
              </Form.Item>
            </div>
          </Col>
          {showDelimiter ? (<><Col xs={24} sm={12} md={8}>
            <div className="form-group ">
              <label className="label">Delimiter</label>
              <Form.Item name="deli_meter" className="m-0" rules={[{ required: true, message: 'Delimiter is Required' }]}>
                <Select
                  placeholder="Select a Delimit"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value=";">Semi Colon(;)</Option>
                  <Option value=",">Comma(,)</Option>
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
            </Col></>) : <></>}
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
              tableData?.length > 10 ? '50' : '-',
              tableData?.length > 50 ? '100' : '-',
              tableData?.length > 100 ? '500' : '-',
            ],
            total: tableData?.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          dataSource={!firstFlag ? records : tableData}
          columns={columns}
          className="custom-table first-row-header"
        />

        <div className="btns-block modal-footer">
          <Button key="submit" type="primary" htmlType="submit" >
            Ok
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PreviewExcel;
