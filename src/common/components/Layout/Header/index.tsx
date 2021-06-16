import React from 'react';
import { Link } from 'react-router-dom';

function toggleMenu() {
  if (window.innerWidth > 767) {
    document.body.classList.toggle('toggle-menu');
  } else {
    document.body.classList.toggle('show-menu');
  }

  document.getElementById('hamburger').classList.toggle('is-active');
}

function Header() {
  return (
    <header className="header">
      <div className="left-header">
        <a href="#" title="Home" className="logo">
          <img src={`${process.env.PUBLIC_URL}assets/images/logo.png`} alt="" />
        </a>
      </div>
      <div className="right-header">
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <div className="profile-wrapper">
          <a href="#" title="" className="profile-block">
            <em className="dp">
              <img src={`${process.env.PUBLIC_URL}assets/images/dp.jpg`} alt="" />
            </em>
            <span className="username">John Smith</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
