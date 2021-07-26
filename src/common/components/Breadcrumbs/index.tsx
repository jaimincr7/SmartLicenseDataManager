import React, { useEffect, useState } from 'react';
import { IMenu } from '../../../services/user/menu/menu.model';
import { useAppSelector } from '../../../store/app.hooks';
import { userSelector } from '../../../store/user/user.reducer';
import { IBreadCrumbsProps } from './breadcrumbs.model';

const BreadCrumbs: React.FC<IBreadCrumbsProps> = (props) => {
  const userDetails = useAppSelector(userSelector);
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    const menus = userDetails.getMenuRight?.data?.menus;
    if (menus?.length > 0) {
      const currentMenu = menus.find((x) => x.name === props.pageName);
      checkParentMenu(currentMenu, menus, currentMenu.description);
    }
  }, [userDetails.getMenuRight?.data?.menus]);

  const checkParentMenu = (menu: IMenu, menus: IMenu[], updatedTitle: string) => {
    if (menu.parent_menu_id > 0) {
      const parentMenu = menus.find((x) => x.id === menu.parent_menu_id);
      updatedTitle = `${parentMenu.description} > ${updatedTitle}`;
      checkParentMenu(parentMenu, menus, updatedTitle);
    } else {
      setPageTitle(updatedTitle);
    }
  };
  return <h4 className="p-0">{pageTitle}</h4>;
};

export default BreadCrumbs;
