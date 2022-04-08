import { Menu, Dropdown, Button } from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { msalInstance } from '../../../../utils/authConfig';
// import authService from '../../../../services/auth/auth.service';
import { userSelector } from '../../../../store/administration/administration.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { clearGlobalSearch } from '../../../../store/globalSearch/globalSearch.reducer';
import { commonSelector } from '../../../../store/common/common.reducer';
import { getProccessRunning } from '../../../../store/common/common.action';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Can } from '../../../ability';
import { Action, Page } from '../../../constants/pageAction';

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
  const dispatch = useAppDispatch();

  function handleLogout(instance) {
    dispatch(clearGlobalSearch());
    instance.logoutRedirect().catch((e: Error) => {
      toast.error(e.message);
    });
  }

  return (
    <Menu>
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

const backgroundProcesses = () => {
  const common = useAppSelector(commonSelector);
  const history = useHistory();
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    const dummyResult = _.cloneDeep(common.processRunning.data);
    const data = [];
    dummyResult?.map((x) => {
      if (!data?.find((a) => a.name == x.type)) {
        const countData = common.processRunning.data?.filter((data1) => data1.type == x.type);
        const obj = {
          name: x.type,
          count: countData?.length,
        };
        data.push(obj);
      }
    });
    setProcesses(data);
  }, [common.processRunning.data]);

  useEffect(() => {
    return () => {
      setProcesses([]);
    };
  }, []);

  return (
    <Menu>
      {processes.length ? (
        processes.map((data) => (
          <Menu.Item key={data.name} className="auto-cursor">
            <span>
              {data.name} - [{data.count}]
            </span>
          </Menu.Item>
        ))
      ) : (
        <span>No Processes are running</span>
      )}
      <hr />
      <Can I={Action.View} a={Page.BackgroundProcesses}>
        <Button
          type="primary"
          style={{marginLeft: '10px',marginBottom: '3px'}}
          onClick={() => history.push('/administration/back-ground-processes')}
        >
          More Info
        </Button>
      </Can>
    </Menu>
  );
};

function Header() {
  const userDetails = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const checkProcess = () => {
    dispatch(getProccessRunning());
  };

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
          <Dropdown
            overlay={backgroundProcesses()}
            trigger={['click']}
            overlayClassName="profile-dropdown"
          >
            <a
              href="#"
              title=""
              className="profile-block"
              onClick={() => {
                checkProcess();
              }}
            >
              <em className="dp">
                {/* <img src={`${process.env.PUBLIC_URL}/assets/images/dp.jpg`} alt="" /> */}
              </em>
              <span className="username">Background Processes</span>
            </a>
          </Dropdown>
          <Dropdown overlay={profileMenu()} trigger={['click']} overlayClassName="profile-dropdown">
            <a
              href="#"
              title=""
              className="profile-block"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
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
