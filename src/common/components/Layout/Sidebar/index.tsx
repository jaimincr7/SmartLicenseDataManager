import React from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();
  const defaultSubmenu: string = location.pathname.split('/')[1];

  return (
    <aside className="main-navigation">
      <Scrollbars renderThumbVertical={(props) => <div {...props} className="track-vartical" />}>
        <Menu
          // defaultSelectedKeys={['/']}
          defaultOpenKeys={[`${defaultSubmenu}`]}
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
            key="ad"
            icon={
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-active-directory.svg`} alt="" />
            }
            title="AD"
            className="no-icon"
          >
            <Menu.Item key="/ad/ad-devices">
              <Link to="/ad/ad-devices" title="AD Devices">
                AD Devices
              </Link>
            </Menu.Item>
            <Menu.Item key="/ad/ad-devices-exclusions">
              <Link to="/ad/ad-devices-exclusions" title="AD-Devices Exclusions">
                Exclusions
              </Link>
            </Menu.Item>
            <Menu.Item key="/ad/ad-users">
              <Link to="/ad/ad-users" title="AD Users">
                AD Users
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sql-server"
            icon={
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-server-outline.svg`} alt="" />
            }
            title="SQL Server"
            className="no-icon"
          >
            <Menu.Item key="/sql-server">
              <Link to="/sql-server" title="Inventory">
                Inventory
              </Link>
            </Menu.Item>
            <Menu.Item key="/sql-server/entitlements">
              <Link to="/sql-server/entitlements" title="Entitlements">
                Entitlements
              </Link>
            </Menu.Item>
            <Menu.Item key="/sql-server/overrides">
              <Link to="/sql-server/overrides" title="Overrides">
                Overrides
              </Link>
            </Menu.Item>
            <Menu.Item key="/sql-server/pricing">
              <Link to="/sql-server/pricing" title="Pricing">
                Pricing
              </Link>
            </Menu.Item>
            <Menu.Item key="/sql-server/license">
              <Link to="/sql-server/license" title="License">
                License
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="data-input"
            icon={
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-data-input.svg`} alt="" />
            }
            title="Data Input"
            className="no-icon"
          >
            <Menu.Item key="/data-input/bulk-import">
              <Link to="/data-input/bulk-import" title="Bulk Import">
              Bulk Import
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
