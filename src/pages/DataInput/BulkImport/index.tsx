import { Button, Checkbox, Col, Form, Popover, Row, Select, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  bulkInsert,
  getTables,
  getExcelColumns,
  getTableColumns,
  getTablesForImport,
  saveTableForImport,
  getExcelFileMapping,
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
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { SettingOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import RenderBI from '../RenderBI';
import { UploadFile } from 'antd/lib/upload/interface';
import { IDatabaseTable } from '../../../services/common/common.model';

let valuesArray = [];

const { Option } = Select;

const BulkImport: React.FC = () => {
  const bulkImports = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { Dragger } = Upload;
  const [formUpload] = Form.useForm();

  const [count, setCount] = useState({ save: 0, reset: 0 });
  const [defaultFile, setDefaultFile] = useState(null);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [excelColumnState, setExcelColumnState] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([]);

  let { table } = useParams<{ table: string }>();
  table && (table = decodeURIComponent(table));
  const [tableName, setTableName] = useState<string>(table);

  const uploadFile = async (options) => {
    const { onSuccess, file } = options;
    const formData = new FormData();
    formData.append('file', file);
    onSuccess('Ok');
  };

  useEffect(() => {
    if (bulkImports.getExcelColumns.data) {
      setExcelColumnState(bulkImports.getExcelColumns.data);
    }
  }, [bulkImports.getExcelColumns.data]);

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
        setExcelColumnState([]);
        setDefaultFile(null);
      } else {
        const result = excelColumnState.filter((o) =>
          fileList.some(({ name }) => o.original_filename === name)
        );
        setExcelColumnState(result);
      }
    } else if (file.status === 'done') {
      const formData = new FormData();
      fileList?.forEach((ele) => {
        formData.append('file', ele.originFileObj ? ele.originFileObj : ele);
      });
      try {
        dispatch(getExcelColumns(formData));
      } catch (err) {
        toast.error(err?.toString());
      }
      setDefaultFile(fileList);
    }
    formUpload.setFieldsValue({ sheet_name: '' });
  };

  const formUploadInitialValues = {
    header_row: 1,
  };

  useEffect(() => {
    if (bulkImports.bulkInsert.messages.length > 0 && (count.save > 0 || count.reset > 0)) {
      if (bulkImports.bulkInsert.hasErrors) {
        toast.error(bulkImports.bulkInsert.messages.join(' '));
      } else {
        toast.success(bulkImports.bulkInsert.messages.join(' '));
        dispatch(clearExcelColumns());
        dispatch(clearBulkImportMessages());
        onCancel();
        if (table) {
          history.goBack();
        }
      }
    }
  }, [bulkImports.bulkInsert.messages]);

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

  useEffect(() => {
    return () => {
      dispatch(clearGetTableColumns());
    };
  }, []);

  useEffect(() => {
    if (bulkImports.saveExcelFileMapping.messages.length > 0) {
      toast.success(bulkImports.saveExcelFileMapping.messages.join(' '));
      dispatch(clearBulkImportMessages());
    }
  }, [bulkImports.saveExcelFileMapping.messages]);

  const getExcelMappingColumns = () => {
    if (formUpload?.getFieldValue('table_name') && defaultFile?.name) {
      dispatch(
        getExcelFileMapping({
          table_name: formUpload.getFieldValue('table_name'),
          key_word: defaultFile?.name?.split('.')[0],
        })
      );
    }
  };

  useEffect(() => {
    getExcelMappingColumns();
  }, [formUpload?.getFieldValue('table_name')]);

  useEffect(() => {
    getExcelMappingColumns();
  }, [defaultFile]);

  const handleSave = (data) => {
    valuesArray.push(data);
    if (valuesArray?.length > 0 && valuesArray?.length === excelColumnState?.length) {
      const remainingFiles = [];
      valuesArray?.forEach((val) => {
        try {
          dispatch(bulkInsert(val));
        }
        catch (e) {
          const orgFileName = excelColumnState?.find(x => x.filename === val?.file_name)?.original_filename;
          remainingFiles.push(orgFileName)
        }
      });
      if (remainingFiles?.length > 0) {
        toast.error("Listed filed does not imported ," + remainingFiles.toString());
      }
    }
  };

  const onCancel = () => {
    dispatch(clearExcelColumns());
    setExcelColumnState([]);
    valuesArray = [];
    setDefaultFileList([]);
    setCount({ save: 0, reset: 0 });
    formUpload.resetFields();
    setDefaultFileList([]);
    setTableName('');
  };
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
        <div >
          <div className="main-card">
            <div >
              <Form form={formUpload} name="formUpload" initialValues={formUploadInitialValues}>
                <Row gutter={[30, 20]} className="align-item-start">
                  <Col xs={24} md={12}>
                    <label className="label w-100"></label>
                    <Form.Item name={'upload_file'} className="m-0">
                      <div className="upload-file">
                        <Dragger
                          accept=".xls,.xlsx,.csv"
                          customRequest={uploadFile}
                          multiple={true}
                          onChange={handleOnChange}
                          fileList={defaultFileList}
                          className="py-sm"
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
                          loading={bulkImports.getTables.loading}
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
          ) : (
            excelColumnState?.length > 0 &&
            bulkImports.getExcelColumns.data?.map(
              (data: any, index) =>
                excelColumnState?.find((x) => x.original_filename === data.original_filename) && (
                  <div key={'render-bi-' + index}>
                    <RenderBI
                      handleSave={(data: any) => handleSave(data)}
                      count={count}
                      fileData={data}
                      seqNumber={index + 1}
                      table={tableName}
                    ></RenderBI>
                    <br />
                    <br />
                  </div>
                )
            )
          )}
          <div className="btns-block">
            <Button
              type="primary"
              onClick={() => {
                setCount({ ...count, save: count.save + 1 });
                valuesArray = [];
              }}
              loading={bulkImports.bulkInsert.loading}
            >
              Save
            </Button>
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
