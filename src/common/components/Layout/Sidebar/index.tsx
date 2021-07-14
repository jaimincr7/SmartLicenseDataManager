import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
import { userSelector } from '../../../../store/user/user.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getMenuRights } from '../../../../store/user/user.action';
const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();
  const defaultSubmenu: string = location.pathname.split('/')[1];
  const userDetails = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(getMenuRights());
  }, []);

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

          {userDetails.getMenuRight?.sideBarData?.map((menuDetail: any) => (
            menuDetail.childMenus?.length > 0 &&
            <SubMenu
              key={menuDetail?.name}
              icon={
                <img src={`${process.env.PUBLIC_URL}/assets/images/${menuDetail?.icon}`} alt="" />
              }
              title={menuDetail?.description}
              className="no-icon"
            >
              {menuDetail.childMenus?.map((childMenu) => (
                <Menu.Item key={`${childMenu.url}`}>
                  <Link to={`${childMenu.url}`} title={childMenu?.description}>
                    {childMenu?.description}
                  </Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
