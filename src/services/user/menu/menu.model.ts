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

export interface IAccessMenuRights {
  role_id: number;
  menu_access_right_ids: string[];
}

export interface IAccessCompanyMenuRights {
  company_id: number;
  menu_access_right_ids: string[];
}
