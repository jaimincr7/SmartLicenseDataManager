import { ISearch } from '../../../common/models/common';

export interface ISearchMenu extends ISearch {}

export interface IAccessRight {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface IMenuRight {
  id: number;
  is_rights: boolean;
  access_rights: IAccessRight;
}

export interface IAccessMenuRight {
  id: number;
  menu_id: number;
  status: boolean;
  access_rights_id: number;
  access_rights: IAccessRight;
}

export interface IMenu {
  id?: number;
  name?: string;
  description?: string;
  parent_menu_id?: number;
  url?: string;
  icon?: string;
  status?: boolean;
  is_display?: boolean;
  menu_rights?: IMenuRight[];
  level?: number;
  child_menu_rights?: number[];
}

export interface IAccessMenu {
  id?: number;
  name?: string;
  description?: string;
  parent_menu_id?: number;
  url?: string;
  icon?: string;
  status?: boolean;
  type?: string;
  is_display?: boolean;
  menu_access_rights?: IAccessMenuRight[];
  level?: number;
  child_menu_rights?: number[];
}

export interface IMenuRightsByRoleId {
  menus?: IMenu[];
  access_rights?: IAccessRight[];
  maxLevel?: number;
}

export interface IMenuRightsByCompanyId {
  menus?: IMenu[];
  access_rights?: IAccessRight[];
  maxLevel?: number;
}

export interface IGetMenuAccessRights {
  menus?: IAccessMenu[];
  access_rights?: IAccessRight[];
  maxLevel?: number;
}

export interface IAccessMenuRights {
  role_id: number;
  menu_access_right_ids: string[];
}

export interface IAddParentMenu {
  description: number;
  status: boolean;
  icon: string;
}

export interface IAccessCompanyMenuRights {
  company_id: number;
  menu_access_right_ids: string[];
}

export interface IMenuAccessRights {
  menu_access_right_ids: number[];
}

export interface ISideBarRights extends IMenuRightsByRoleId {
  sideBarMenus?: any;
}
