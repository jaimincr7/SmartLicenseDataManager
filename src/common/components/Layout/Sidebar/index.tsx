import React from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();
  const defaultSubmenu: string = location.pathname.split('/')[1];

  window.addEventListener('click', function (e) {
    if (
      document.querySelector('.main-navigation').contains(e.target as Node) ||
      document.querySelector('.hamburger').contains(e.target as Node)
    ) {
      //console.log("Clicked in Box");
    } else {
      //console.log("Clicked outside Box");
      if (window.innerWidth > 991) {
        document.body.classList.remove('toggle-menu');
      } else {
        document.body.classList.remove('show-menu');
      }
    }
  });

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
            <Menu.Item key="/sql-server/inventory">
              <Link to="/sql-server/inventory" title="Inventory">
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
            <Menu.Item key="/sql-server/exclusions">
              <Link to="/sql-server/exclusions" title="Exclusions">
                Exclusions
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="windows-server"
            icon={
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-windows-server.svg`} alt="" />
            }
            title="Windows Server"
            className="no-icon"
          >
            <Menu.Item key="/windows-server/inventory">
              <Link to="/windows-server/inventory" title="Inventory">
                Inventory
              </Link>
            </Menu.Item>
            <Menu.Item key="/windows-server/entitlements">
              <Link to="/windows-server/entitlements" title="Entitlements">
                Entitlements
              </Link>
            </Menu.Item>
            <Menu.Item key="/windows-server/overrides">
              <Link to="/windows-server/overrides" title="Overrides">
                Overrides
              </Link>
            </Menu.Item>
            <Menu.Item key="/windows-server/pricing">
              <Link to="/windows-server/pricing" title="Pricing">
                Pricing
              </Link>
            </Menu.Item>
            <Menu.Item key="/windows-server/license">
              <Link to="/windows-server/license" title="License">
                License
              </Link>
            </Menu.Item>
            <Menu.Item key="/windows-server/exclusions">
              <Link to="/windows-server/exclusions" title="Exclusions">
                Exclusions
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="data-input"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-data-input.svg`} alt="" />}
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
