import { useEffect, useState } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { toast } from 'react-toastify';
import { msalInstance } from '../../../../utils/authConfig';
// import authService from '../../../../services/auth/auth.service';
import { userSelector } from '../../../../store/administration/administration.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { SyncOutlined } from '@ant-design/icons';
import { getCronJobStatus } from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { useHistory } from 'react-router-dom';

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
  const common = useAppSelector(commonSelector);
  const userDetails = useAppSelector(userSelector);
  const [cronStatus, setCronStatus] = useState('');
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getCronJobStatus());
    setCronStatus(common.cronJobStatus.data.toString());
  }, [common.cronJobStatus.data]);

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
        <div className="profile-wrapper right-list">
          {cronStatus === 'stopped' ? (
            <>
              {' '}
              <Button
                className="btn-icon"
                onClick={() => history.push(`/administration/schedule-api-data`)}
              >
                Click to Start
              </Button>
              <SyncOutlined style={{ color: 'red', fontSize: '20px' }} />{' '}
            </>
          ) : (
            ''
          )}
          {cronStatus === 'running' ? (
            <>
              {' '}
              <Button
                className="btn-icon"
                onClick={() => history.push(`/administration/schedule-api-data`)}
              >
                Click to Manage
              </Button>
              <SyncOutlined style={{ color: 'green' }} spin />
            </>
          ) : (
            ''
          )}

          <Dropdown overlay={profileMenu()} trigger={['click']} overlayClassName="profile-dropdown">
            <a href="#" title="" className="profile-block" onClick={(e) => e.preventDefault()}>
              <em className="dp">
                {/* <img src={`${process.env.PUBLIC_URL}/assets/images/dp.jpg`} alt="" /> */}
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
