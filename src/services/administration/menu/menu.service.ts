import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IMenu,
  IMenuRightsByRoleId,
  ISearchMenu,
  IAccessMenuRights,
  IMenuRightsByCompanyId,
  IAccessCompanyMenuRights,
  IMenuAccessRights,
  IGetMenuAccessRights,
  IAddParentMenu,
} from './menu.model';

class MenuService {
  ENDPOINT = '/menu';

  public async searchMenu(
    searchParams?: ISearchMenu
  ): Promise<IApiResponse<ISearchResponse<IMenu>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getMenuById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async addParentMenu(data: IAddParentMenu): Promise<any> {
    const url = `${this.ENDPOINT}/parent-menu`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async deleteParentMenu(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/delete-parent/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async saveMenu(data: IMenu): Promise<any> {
    const { id, ...restData } = data;
    if (id > 0) {
      const url = `${this.ENDPOINT}/${id}`;
      return request({ url, method: 'PUT', data: restData }).then((res) => {
        return res.data;
      });
    } else {
      const url = `${this.ENDPOINT}`;
      return request({ url, method: 'POST', data: restData }).then((res) => {
        return res.data;
      });
    }
  }

  public async getMenuRightsByRoleId(roleId: number): Promise<IApiResponse<IMenuRightsByRoleId>> {
    const url = `${this.ENDPOINT}/menu-rights/${roleId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveMenuAccessRights(data: IAccessMenuRights): Promise<any> {
    const url = `/role-menu-access-right`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getMenuRightsByCompanyId(
    companyId: number
  ): Promise<IApiResponse<IMenuRightsByCompanyId>> {
    const url = `${this.ENDPOINT}/company-menu-rights/${companyId}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveCompanyMenuAccessRights(data: IAccessCompanyMenuRights): Promise<any> {
    const url = `/company-menu-access-right`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }

  public async getSideBarMenuRights(): Promise<IApiResponse<IMenuRightsByRoleId>> {
    const url = `${this.ENDPOINT}/sidebar`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getMenuAccessRights(): Promise<IApiResponse<IGetMenuAccessRights>> {
    const url = `${this.ENDPOINT}/menu-access-rights`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveAddRemoveMenuAccessRights(data: IMenuAccessRights): Promise<any> {
    const url = `/menu-access-rights`;
    return request({ url, method: 'POST', data: data }).then((res) => {
      return res.data;
    });
  }
}
export default new MenuService();
