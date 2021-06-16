import { IHomeProps } from './home.model';
import './home.style.scss';
import { Select, Row, Col, Button, DatePicker, Input, Menu, Dropdown, Checkbox, Modal } from 'antd';
import Ctable from './Ctable';
import React from 'react';
const { Option } = Select;
const { TextArea } = Input;

const dropdownMenu = (
  // BU
  // Date Added
  // Event Date
  // Contract Type
  // Event Trigger Type
  // Description
  // Expenditure Amount
  // Expenditure Type

  <Menu>
    <Menu.Item key="0">
      <Checkbox>Tenant</Checkbox>
    </Menu.Item>
    <Menu.Item key="1">
      <Checkbox>Company</Checkbox>
    </Menu.Item>
  </Menu>
);

const Home: React.FC<IHomeProps> = () => {
  const [modal1Visible, setmodal1Visible] = React.useState(false);

  const setModal1Visible = () => {
    setmodal1Visible(true);
  };
  const setModal1Hide = () => {
    setmodal1Visible(false);
  };

  return (
    <div className="homePage">
      <div className="title-block">
        <h4 className="p-0">Events</h4>
        <div className="right-title">
          <Select
            placeholder="Tags Mode"
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
          >
            <Option value="1">John Smith</Option>
            <Option value="2">John Smith</Option>
            <Option value="3">John Smith</Option>
          </Select>
          <Select
            placeholder="Filter by Company"
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
          >
            <Option value="1">John Smith</Option>
            <Option value="2">John Smith</Option>
            <Option value="3">John Smith</Option>
          </Select>
          <Select
            placeholder="Filter by BU"
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
          >
            <Option value="1">John Smith</Option>
            <Option value="2">John Smith</Option>
            <Option value="3">John Smith</Option>
          </Select>
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[30, 15]}>
            <Col sm={24} md={8} lg={6}>
              <div className="form-group m-0">
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
              </div>
            </Col>
            <Col sm={24} md={8} lg={6}>
              <div className="form-group m-0">
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
              </div>
            </Col>
            <Col sm={24} md={8} lg={6}>
              <div className="form-group m-0">
                <label className="label">Event Date</label>
                <DatePicker className="w-100" />
              </div>
            </Col>
            <Col sm={24} md={24} lg={6}>
              <div className="btns-block">
                <Button type="primary">Search</Button>
                <Button>Clear</Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="title-block search-block">
          <Input
            placeholder="Search by keyword"
            className="form-control sm-input"
            prefix={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-search.svg`} alt="" />}
          />
          <div className="btns-block">
            <Dropdown overlay={dropdownMenu} trigger={['click']} overlayClassName="custom-dropdown">
              <Button
                icon={
                  <em className="anticon">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/ic-lines.svg`} alt="" />
                  </em>
                }
              >
                Show/Hide Columns
              </Button>
            </Dropdown>
            <Button type="primary" onClick={setModal1Visible}>
              Add Event
            </Button>
            <Modal
              wrapClassName="custom-modal"
              title="Add Events"
              centered
              visible={modal1Visible}
              onOk={setModal1Hide}
              onCancel={setModal1Hide}
              footer={[
                <Button key="submit" type="primary" onClick={setModal1Hide}>
                  Save
                </Button>,
                <Button key="back" onClick={setModal1Hide}>
                  Cancel
                </Button>,
              ]}
            >
              <Row gutter={[30, 15]}>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Event Type</label>
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}images/ic-down.svg`} alt="" />
                      }
                    >
                      <Option value="1">John Smith</Option>
                      <Option value="2">John Smith</Option>
                      <Option value="3">John Smith</Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
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
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
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
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
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
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Date Added</label>
                    <DatePicker className="w-100" />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Event Date</label>
                    <DatePicker className="w-100" />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
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
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Expenditure Amount</label>
                    <Input className="form-control" prefix={<span>$</span>} />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Event Name</label>
                    <Input className="form-control" />
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="form-group m-0">
                    <label className="label">Event Description</label>
                    <TextArea className="form-control" />
                  </div>
                </Col>
              </Row>
            </Modal>
          </div>
        </div>
        <Ctable />
      </div>
    </div>
  );
};

export default Home;
