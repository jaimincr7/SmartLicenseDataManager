import { Select, Row, Col, Button } from 'antd';
const { Option } = Select;

function UploadExcel() {
  return (
    <div className="update-excel-page">
      <div className="title-block">
        <h4 className="p-0">Update from Excel</h4>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <div className="btns-block f-wrap">
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
            <div className="upload-file-path">
              <em className="d-flex">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/ic-baseline-attachment.svg`}
                  alt=""
                />
              </em>
              <span className="file-name">xyz.xls</span>
              <Button className="action-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
              </Button>
            </div>
          </div>
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
