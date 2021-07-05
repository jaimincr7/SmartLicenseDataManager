import React from 'react';
import { Menu, Dropdown } from 'antd';
import { toast } from 'react-toastify';
import { msalInstance } from '../../../../utils/authConfig';
import authService from '../../../../services/auth/auth.service';
import { userSelector } from '../../../../store/user/user.reducer';
import { useAppSelector } from '../../../../store/app.hooks';

function toggleMenu() {
  if (window.innerWidth > 991) {
    document.body.classList.toggle('toggle-menu');
  } else {
    document.body.classList.toggle('show-menu');
  }
}

window.addEventListener(
  'resize',
  function () {
    if (window.innerWidth > 991) {
      document.body.classList.remove('toggle-menu');
    } else {
      document.body.classList.remove('show-menu');
    }
  },
  true
);

const profileMenu = () => {
  const instance = msalInstance;

  function handleLogout(instance) {
    instance.logoutRedirect().catch((e: Error) => {
      toast.error(e.message);
    });
  }

  return (
    <Menu>
      <Menu.Item
        key="0"
        icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-user.svg`} alt="" />}
      >
        <a href="#" title="My Profile">
          My Profile
        </a>
      </Menu.Item>
      <Menu.Item
        key="1"
        icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-logout.svg`} alt="" />}
      >
        <a onClick={() => handleLogout(instance)} title="Logout">
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );
};

function Header() {
  
  const userDetails = useAppSelector(userSelector);

  return (
    <header className="header">
      <div className="left-header">
        <a href="/" title="Home" className="logo">
          <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="" />
        </a>
      </div>
      <div className="right-header">
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <div className="profile-wrapper">
          <Dropdown overlay={profileMenu()} trigger={['click']} overlayClassName="profile-dropdown">
            <a href="#" title="" className="profile-block" onClick={(e) => e.preventDefault()}>
              <em className="dp">
                <img src={`${process.env.PUBLIC_URL}/assets/images/dp.jpg`} alt="" />
              </em>
              <span className="username">{userDetails.activeAccount?.name}</span>
            </a>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Header;
