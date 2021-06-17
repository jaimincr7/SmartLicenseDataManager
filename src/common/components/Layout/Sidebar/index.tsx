import React from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';
const { SubMenu } = Menu;

function Sidebar() {
  return (
    <aside className="main-navigation">
      <Scrollbars renderThumbVertical={(props) => <div {...props} className="track-vartical" />}>
        <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
          <Menu.Item
            key="1"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-dashboard.svg`} alt="" />}
          >
            <a href="#" title="Dashboard">
              Dashboard
            </a>
          </Menu.Item>
          <SubMenu
            key="sub1"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cms.svg`} alt="" />}
            title="CMS"
          >
            <Menu.Item
              key="2"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-dashboard-2.svg`} alt="" />
              }
            >
              <a href="#" title="Dashboard">
                Dashboard
              </a>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/ant-design_calendar-outlined.svg`}
                  alt=""
                />
              }
            >
              <a href="#" title="Events">
                Events
              </a>
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cart.svg`} alt="" />}
            >
              <a href="#" title="Purchases">
                Purchases
              </a>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/sql-server" title="SQL Server">SQL Server</Link>             
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/sql-server/entitlements" title="Entitlements">Entitlements</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-magic-wand.svg`} alt="" />}
            title="SIMPLE"
          >
            <Menu.Item key="6">Dashboard</Menu.Item>
            <Menu.Item key="7">Events</Menu.Item>
            <Menu.Item key="8">Purchases</Menu.Item>
            <Menu.Item key="9">Entitlements</Menu.Item>
          </SubMenu>
          <Menu.Item
            key="10"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-settings.svg`} alt="" />}
          >
            <a href="#" title="Settings">
              Settings
            </a>
          </Menu.Item>
        </Menu>
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
