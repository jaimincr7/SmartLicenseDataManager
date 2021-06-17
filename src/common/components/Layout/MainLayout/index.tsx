import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { IMainLayoutProps } from './mainLayout.model';

export const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </>
  );
};
export default MainLayout;
