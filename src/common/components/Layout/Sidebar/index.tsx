import React from 'react';
import { Menu, Modal } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useLocation } from 'react-router-dom';
import { userSelector } from '../../../../store/administration/administration.reducer';
import { useAppSelector } from '../../../../store/app.hooks';
import Version from '../../../../pages/Version';
import ability from '../../../ability';
import { Action, Page } from '../../../constants/pageAction';

const { SubMenu } = Menu;

function Sidebar() {
  const location = useLocation();
  const defaultSubmenu: string = location.pathname.split('/')[1];
  const userDetails = useAppSelector(userSelector);
  const [openKeys, setOpenKeys] = React.useState([`${defaultSubmenu}`]);
  const [showVersionModal, setShowVersionModal] = React.useState(false);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (keys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      if ((latestOpenKey?.match(/!/g) || []).length > 1) {
        setOpenKeys([...openKeys, latestOpenKey]);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    }
  };

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
          {childMenu.childMenus?.map((menu, index: number) => renderMenu(menu, `${key}!${index}`))}
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
        <div className="sidebar-main">
          <Menu
            // defaultSelectedKeys={['/']}
            openKeys={openKeys}
            defaultOpenKeys={[`${defaultSubmenu}`]}
            onOpenChange={onOpenChange}
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
              renderMenu(menuDetail, `!${index}`)
            )}
          </Menu>
          <div className="sidebar-version">
            <hr />
            <span
              onClick={() => {
                if (ability.can(Action.View, Page.Version)) setShowVersionModal(true);
              }}
            >
              Version: 1.6.2
            </span>
          </div>
        </div>
        {showVersionModal && (
          <Modal
            wrapClassName="custom-modal"
            title="Synapse 360"
            centered
            visible={showVersionModal}
            onCancel={() => setShowVersionModal(false)}
            footer={false}
          >
            <Version />
          </Modal>
        )}
      </Scrollbars>
    </aside>
  );
}

export default Sidebar;
