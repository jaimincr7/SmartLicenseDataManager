import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  IMenu,
  IMenuRightsByRoleId,
  ISearchMenu,
  IAccessMenuRights,
  IRoleLookup,
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

  public async getRoleLookup(): Promise<IApiResponse<IRoleLookup>> {
    const url = `/role/lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }
}
export default new MenuService();
