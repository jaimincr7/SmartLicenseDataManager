import React from 'react';
import { Menu, Button } from 'antd';
const { SubMenu } = Menu;

function Sidebar() {
  return (
    <aside className="main-navigation">
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
        <Menu.Item
          key="1"
          icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-dashboard.svg`} alt="" />}
        >
          Dashboard
        </Menu.Item>
        <SubMenu
          key="sub1"
          icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cms.svg`} alt="" />}
          title="CMS"
        >
          <Menu.Item
            key="2"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-dashboard-2.svg`} alt="" />}
          >
            Dashboard
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
            Events
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-cart.svg`} alt="" />}
          >
            Purchases
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-entitlements.svg`} alt="" />
            }
          >
            Entitlements
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
          Settings
        </Menu.Item>
      </Menu>
    </aside>
  );
}

export default Sidebar;
