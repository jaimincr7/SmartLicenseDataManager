import { Button, Col, Form, Row, Select, Spin, Upload } from 'antd';
import { Messages } from '../../../../common/constants/messages';
import './importExcel.style.scss';
import { IImportExcelModalProps } from './importExcel.model';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { bulkInsert, getExcelColumns } from '../../../../store/sqlServer/sqlServer.action';
import {
  clearExcelColumns,
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ImportExcel: React.FC<IImportExcelModalProps> = () => {
  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form] = Form.useForm();

  const [defaultFile, setDefaultFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);

  let initialValues = {};

  const uploadFile = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    // const fileExt = file.name.split('.').pop().toString();

    // if (fileExt.toLowerCase() !== "xls" || fileExt.toLowerCase() !== "xlsx") {
    //     toast.error(`The file you have attempted to upload ${file.name} is not supported.`);
    //     return false;
    // }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('table_name', 'sql server');
    try {
      dispatch(getExcelColumns(formData));
      onSuccess('Ok');
    } catch (err) {
      onError({ err });
    }
  };

  const handleOnChange = ({ file }) => {
    if (file.status === 'removed') {
      dispatch(clearExcelColumns());
      setExcelColumns(null);
      setTableColumns([]);
    } else if (file.status === 'done') {
      setDefaultFile(file);
    }
  };

  const onFinish = (values: any) => {
    const excelToSqlMapping = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key && value) {
        excelToSqlMapping.push({
          key: `${value}`,
          value: `${key}`,
        });
      }
    });
    const inputValues = {
      excel_to_sql_mapping: excelToSqlMapping,
      file_name: sqlServers.getExcelColumns.data.filename,
    };

    console.log(inputValues);
    dispatch(bulkInsert(inputValues));
  };

  const setFormFields = async (data) => {
    if (sqlServers.getExcelColumns.data) {
      const filterExcelColumns = sqlServers.getExcelColumns.data.excel_column.filter(
        (x) => x !== 'Id' && x !== 'Date Added'
      );
      const filterTableColumns = sqlServers.getExcelColumns.data.table_column.filter(
        (x) => x !== 'Id' && x !== 'Date Added'
      );
      await setExcelColumns(filterExcelColumns);
      await setTableColumns(filterTableColumns);

      initialValues = filterTableColumns.map(function (obj, index) {
        const tempObj = {};
        tempObj[filterExcelColumns[index]] = obj;
        return tempObj;
      });
      console.log(initialValues);
      await form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (sqlServers.bulkInsert.messages.length > 0) {
      if (sqlServers.bulkInsert.hasErrors) {
        toast.error(sqlServers.bulkInsert.messages.join(' '));
      } else {
        toast.success(sqlServers.bulkInsert.messages.join(' '));
        history.push('/sql-server');
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.bulkInsert.messages]);

  useEffect(() => {
    setFormFields(sqlServers.getExcelColumns.data);
  }, [sqlServers.getExcelColumns.data]);

  return (
    <>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[30, 15]}>
            <Col xs={24} md={24} lg={6}>
              <div className="btns-block">
                <Upload
                  accept=".xls,.xlsx"
                  customRequest={uploadFile}
                  onChange={handleOnChange}
                  defaultFileList={defaultFile}
                  multiple={false}
                  showUploadList={{
                    showRemoveIcon: true,
                    removeIcon: (
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                    ),
                  }}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
                    Upload Excel
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {sqlServers.getExcelColumns.loading && (
        <div className="spin-loader">
          <Spin spinning={sqlServers.getExcelColumns.loading} />
        </div>
      )}
      {excelColumns && (
        <Form
          form={form}
          name="uploadExcelSheet"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >          
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} md={12} lg={12} xl={8}>
                <div className="form-group form-inline">  
                <label className="label strong">Excel Column</label>
                <label className="strong">Database Name</label>
                </div>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8} className="sm-none">
                <div className="form-group form-inline">  
                <label className="label strong">Excel Column</label>
                <label className="strong">Database Name</label>
                </div>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8} className="lg-none">
                <div className="form-group form-inline">  
                <label className="label strong">Excel Column</label>
                <label className="strong">Database Name</label>
                </div>
            </Col>
            {excelColumns.map((columnName: string, index: number) => (
              <>
                <Col xs={24} md={12} lg={12} xl={8} key={index}>
                    <div className="form-group form-inline">  
                        <label className="label">{columnName}</label>
                        <Form.Item
                            name={columnName}
                            className="m-0"
                            label={columnName}
                            //   rules={[{ required: true }]}
                        >
                        <Select
                            className="w-100"
                            suffixIcon={
                            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                            }
                        >
                            {tableColumns.map((option: string, index: number) => (
                            <Option key={index} value={option}>
                                {option}
                            </Option>
                            ))}
                        </Select>
                    </Form.Item>                        
                    </div>
                </Col>                
              </>
            ))}
            </Row>
            <div className="btns-block">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={sqlServers.bulkInsert.loading}
                >
                    Save
                </Button>
                <Button onClick={() => history.push('/sql-server')}>
                    Cancel
                </Button>
            </div>
        </Form>
      )}
    </>
  );
};
export default ImportExcel;
