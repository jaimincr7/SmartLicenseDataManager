import React, { useEffect, useState } from 'react';
import { IMenu } from '../../../services/administration/menu/menu.model';
import { useAppSelector } from '../../../store/app.hooks';
import { userSelector } from '../../../store/administration/administration.reducer';
import { IBreadCrumbsProps } from './breadcrumbs.model';

const BreadCrumbs: React.FC<IBreadCrumbsProps> = (props) => {
  const { pageName, level } = props;
  const userDetails = useAppSelector(userSelector);
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    const menus = userDetails.getMenuRight?.data?.menus;
    if (menus?.length > 0) {
      const currentMenu = menus.find((x) => x.name === pageName);
      if (currentMenu) {
        checkParentMenu(currentMenu, menus, currentMenu.description, 1);
      }
    }
  }, [userDetails.getMenuRight?.data?.menus, pageName]);

  const checkParentMenu = (menu: IMenu, menus: IMenu[], updatedTitle: string, count: number) => {
    if (menu.parent_menu_id > 0 && (level === undefined || level > count)) {
      const parentMenu = menus.find((x) => x.id === menu.parent_menu_id);
      updatedTitle = `${parentMenu.description} > ${updatedTitle}`;
      checkParentMenu(parentMenu, menus, updatedTitle, count + 1);
    } else {
      setPageTitle(updatedTitle);
    }
  };
  return <>{pageTitle}</>;
};

export default BreadCrumbs;
