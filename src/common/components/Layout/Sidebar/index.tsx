import React from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
import { userSelector } from '../../../../store/administration/administration.reducer';
import { useAppSelector } from '../../../../store/app.hooks';

const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();
  const defaultSubmenu: string = location.pathname.split('/')[1];
  const userDetails = useAppSelector(userSelector);

  window.addEventListener('click', function (e) {
    if (
      document.querySelector('.main-navigation')?.contains(e.target as Node) ||
      document.querySelector('.hamburger')?.contains(e.target as Node)
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

  const renderMenu = (childMenu: any, key = '-') => {
    if (childMenu?.childMenus?.length > 0) {
      return (
        <SubMenu
          key={childMenu?.name + key}
          icon={
            childMenu?.icon && (
              <img src={`${process.env.PUBLIC_URL}/assets/images/${childMenu?.icon}`} alt="" />
            )
          }
          title={childMenu?.description}
        >
          {childMenu.childMenus?.map((menu, index: number) => renderMenu(menu, `${key}-${index}`))}
        </SubMenu>
      );
    } else if (childMenu.parent_menu_id) {
      return (
        <Menu.Item key={`${childMenu.url ? childMenu.url : key}`}>
          <Link to={`${childMenu.url ? childMenu.url : ''}`} title={childMenu?.description}>
            {childMenu?.description}
          </Link>
        </Menu.Item>
      );
    }
  };

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
            <Link to="/" title="Dashboard">
              Dashboard
            </Link>
          </Menu.Item>
          {userDetails.getMenuRight?.sideBarData?.map((menuDetail: any, index: number) =>
            renderMenu(menuDetail, `-${index}`)
          )}
        </Menu>
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
