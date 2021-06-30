import React from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="main-navigation">
      <Scrollbars renderThumbVertical={(props) => <div {...props} className="track-vartical" />}>
        <Menu
          defaultSelectedKeys={['/']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          selectedKeys={[location.pathname]}
        >
          <Menu.Item
            key="/"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-dashboard.svg`} alt="" />}
          >
            <a href="/" title="Dashboard">
              Dashboard
            </a>
          </Menu.Item>
          <SubMenu
            key="sub1"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cms.svg`} alt="" />}
            title="SQL Server"
          >
            <Menu.Item
              key="/sql-server"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/sql-server" title="SQL Server">
                SQL Server
              </Link>
            </Menu.Item>
            <Menu.Item
              key="/sql-server/entitlements"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/sql-server/entitlements" title="Entitlements">
                Entitlements
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cms.svg`} alt="" />}
            title="AD"
          >
            <Menu.Item
              key="/ad/ad-devices"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/ad/ad-devices" title="AD Devices">
                AD Devices
              </Link>
            </Menu.Item>
            <Menu.Item
              key="/ad/ad-devices-exclusion"
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
              }
            >
              <Link to="/ad/ad-devices-exclusion" title="AD-Devices Exclusion">
                AD-Devices Exclusion
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
