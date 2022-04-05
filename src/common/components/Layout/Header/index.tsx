import { Menu, Dropdown } from 'antd';
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
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const [processes, setProcesses] = useState([]);

  function handleLogout(instance) {
    dispatch(clearGlobalSearch());
    instance.logoutRedirect().catch((e: Error) => {
      toast.error(e.message);
    });
  }

  useEffect(() => {
    const dummyResult = _.cloneDeep(common.processRunning.data);
    const data = [];
    dummyResult?.map((x) => {
      if (!data?.find((a) => a.name == x.type)) {
        const countData = common.processRunning.data?.filter((data1) => data1.type == x.type);
        const obj = {
          name: x.type,
          count: countData?.length
        };
        data.push(obj);
      }
    });
    setProcesses(data);
  }, [common.processRunning.data]);

  useEffect(() => {
    return () => {
      setProcesses([]);
    }
  }, []);

  return (
    <Menu>
      {/* <Menu.Item
        key="0"
        icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-user.svg`} alt="" />}
      >
        <a href="#" title="My Profile">
          My Profile
        </a>
      </Menu.Item> */}
      <Menu.Item
        key="1"
        icon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-logout.svg`} alt="" />}
      >
        <a onClick={() => handleLogout(instance)} title="Logout">
          Logout
        </a>
      </Menu.Item>
      {processes.map((data) => (
        <Menu.Item key={data.name}>
          <span >
            {data.name} - [{data.count}]
          </span>
        </Menu.Item>
      ))}
      {/* <a>
          <Progress percent={100} steps={5} size="small" strokeColor="#52c41a" />
        </a> */}
    </Menu>
  );
};

function Header() {
  const userDetails = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const checkProcess = () => {
    dispatch(getProccessRunning());
  }

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
          <Dropdown overlay={profileMenu()} trigger={['click']} overlayClassName="profile-dropdown">
            <a href="#" title="" className="profile-block" onClick={(e) => { e.preventDefault(); checkProcess(); }}>
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
