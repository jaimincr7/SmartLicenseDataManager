import React from 'react';
import { Menu, Dropdown } from 'antd';

import { AzureAD } from 'react-aad-msal';
import { azureAuthProvider } from '../../../../utils/azureProvider';

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

const profileMenu = (
  <AzureAD provider={azureAuthProvider}>
    {({ logout }) => (
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
          <a onClick={logout} title="Logout">
            Logout
          </a>
        </Menu.Item>
      </Menu>
    )}
  </AzureAD>
);

function Header() {
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
        <AzureAD provider={azureAuthProvider}>
          {({ accountInfo }) => (
            <div className="profile-wrapper">
              <Dropdown
                overlay={profileMenu}
                trigger={['click']}
                overlayClassName="profile-dropdown"
              >
                <a href="#" title="" className="profile-block" onClick={(e) => e.preventDefault()}>
                  <em className="dp">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/dp.jpg`} alt="" />
                  </em>
                  <span className="username">{accountInfo.account.name}</span>
                </a>
              </Dropdown>
            </div>
          )}
        </AzureAD>
      </div>
    </header>
  );
}

export default Header;
