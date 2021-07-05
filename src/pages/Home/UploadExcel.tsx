import { Select, Row, Col, Button, Form, Upload } from 'antd';
import { Messages } from '../../common/constants/messages';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/app.hooks';
import { clearSqlServerMessages, sqlServerSelector } from '../../store/sqlServer/sqlServer.reducer';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const { Option } = Select;

function UploadExcel() {
  const sqlServers = useAppSelector(sqlServerSelector);
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
    formData.append('table_name', 'sql server');
    try {
      // dispatch(getExcelColumns(formData));
      onSuccess('Ok');
    } catch (err) {
      onError({ err });
    }
  };

  const handleOnChange = ({ file }) => {
    if (file.status === 'removed') {
      // dispatch(clearExcelColumns());
      setDefaultFile(null);
      setExcelColumns(null);
      setTableColumns([]);
    } else if (file.status === 'done') {
      setDefaultFile(file);
    }
  };

  return (
    <div className="update-excel-page">
      <div className="title-block">
        <h4 className="p-0">Update from Excel</h4>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[30, 20]} className="align-item-start">
            <Col xs={24} md={8}>
              <label className="label w-100">Upload Excel</label>
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
            </Col>
            <Col xs={24} md={8}>
              <div className="form-group m-0">
                <Form.Item className="m-0">
                  <label className="label">Event Trigger Type</label>
                  <Select
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                  >
                    <Option value="1">John Smith</Option>
                    <Option value="2">John Smith</Option>
                    <Option value="3">John Smith</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="form-group m-0">
                <Form.Item className="m-0">
                  <label className="label">Contract Type</label>
                  <Select
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                  >
                    <Option value="1">John Smith</Option>
                    <Option value="2">John Smith</Option>
                    <Option value="3">John Smith</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
        <Row gutter={[30, 0]}>
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
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Tenant</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Company</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">BU</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Sql Cluster</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Host</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Device Name</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Device Type</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Product Family</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Version</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Edition</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Device State</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Software State</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Cluster</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Source</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Operating System</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">OS Type</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Raw software Title</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12} xl={8}>
            <div className="form-group form-inline">
              <label className="label">Product Name</label>
              <Select
                suffixIcon={
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                }
              >
                <Option value="1">John Smith</Option>
                <Option value="2">John Smith</Option>
                <Option value="3">John Smith</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <div className="btns-block">
          <Button type="primary">Save</Button>
          <Button>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;
