import { Button, Col, Form, Row, Select, Spin, Upload } from 'antd';
import { Messages } from '../../../../common/constants/messages';
import { IImportExcelModalProps } from './importExcel.model';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  adUsersSelector,
  clearAdUsersMessages,
  clearExcelColumns,
} from '../../../../store/adUsers/adUsers.reducer';
import { bulkInsert, getExcelColumns } from '../../../../store/adUsers/adUsers.action';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ImportExcel: React.FC<IImportExcelModalProps> = () => {
  const adUsers = useAppSelector(adUsersSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form] = Form.useForm();

  const [defaultFile, setDefaultFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);

  const uploadFile = async (options) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('table_name', 'AdUsers');
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
      setDefaultFile(null);
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
          key: `${key}`,
          value: `${value}`,
        });
      }
    });

    if (excelToSqlMapping.length === 0) {
      return false;
    }
    const inputValues = {
      excel_to_sql_mapping: excelToSqlMapping,
      file_name: adUsers.getExcelColumns.data.filename,
    };
    dispatch(bulkInsert(inputValues));
  };

  const setFormFields = async (data) => {
    if (data) {
      const filterExcelColumns = data.excel_column.filter((x) => x !== 'Id');
      const filterTableColumns = data.table_column.filter((x) => x !== 'Id');
      setExcelColumns(filterExcelColumns);
      setTableColumns(filterTableColumns);

      const initialValuesData: any = {};
      filterTableColumns.map(function (ele) {
        initialValuesData[ele.name] = filterExcelColumns.includes(ele.name) ? ele.name : '';
      });
      form.setFieldsValue(initialValuesData);
    }
  };

  useEffect(() => {
    if (adUsers.bulkInsert.messages.length > 0) {
      if (adUsers.bulkInsert.hasErrors) {
        toast.error(adUsers.bulkInsert.messages.join(' '));
      } else {
        toast.success(adUsers.bulkInsert.messages.join(' '));
        history.push('/ad/ad-users');
      }
      dispatch(clearAdUsersMessages());
    }
  }, [adUsers.bulkInsert.messages]);

  useEffect(() => {
    setFormFields(adUsers.getExcelColumns.data);
  }, [adUsers.getExcelColumns.data]);

  useEffect(() => {
    return () => {
      dispatch(clearExcelColumns());
    };
  }, [dispatch]);

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
          <h4 className="p-0">Update from Excel</h4>
          <div className="btns-block">
            <Button
              className="btn-icon"
              type="primary"
              onClick={() => history.push('/ad/ad-users')}
              icon={
                <em className="anticon">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-left-arrow.svg`} alt="" />
                </em>
              }
            >
              Back
            </Button>
          </div>
        </div>
        <div className="main-card">
          <div className="input-btns-title">
            <div className="upload-file">
              <Upload
                accept=".xls,.xlsx"
                customRequest={uploadFile}
                onChange={handleOnChange}
                defaultFileList={defaultFile}
                maxCount={1}
                showUploadList={{
                  showRemoveIcon: true,
                  removeIcon: (
                    <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                  ),
                }}
              >
                <Button
                  type="primary"
                  className="btn-icon"
                  icon={
                    <em className="anticon">
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-upload.svg`} alt="" />
                    </em>
                  }
                >
                  Upload Excel
                </Button>
              </Upload>
            </div>
          </div>
          {adUsers.getExcelColumns.loading && (
            <div className="spin-loader">
              <Spin spinning={adUsers.getExcelColumns.loading} />
            </div>
          )}
          {!adUsers.getExcelColumns.loading && excelColumns && (
            <Form
              form={form}
              name="uploadExcelSheet"
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
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
                <Button type="primary" htmlType="submit" loading={adUsers.bulkInsert.loading}>
                  Save
                </Button>
                <Button onClick={() => history.push('/sql-server')}>Cancel</Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};
export default ImportExcel;
