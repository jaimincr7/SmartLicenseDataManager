import { Select, Row, Col, Button, DatePicker, Input } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

function AddEvent() {
  return (
    <div className="homePage">
      <div className="title-block">
        <h4 className="p-0">Add Event</h4>
      </div>
      <div className="main-card">
        <Row gutter={[30, 0]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Event Type</label>
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Date Added</label>
              <DatePicker className="w-100" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Event Date</label>
              <DatePicker className="w-100" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Expenditure Type</label>
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Expenditure Amount</label>
              <Input className="form-control" prefix={<span>$</span>} />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="form-group">
              <label className="label">Event Name</label>
              <Input className="form-control" />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <div className="form-group">
              <label className="label">Event Description</label>
              <TextArea className="form-control" />
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

export default AddEvent;
