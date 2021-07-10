import { IMenu } from '../../../../services/user/menu/menu.model';

export interface IEditMenuModal {
  selectedMenu: IMenu;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  parentMenu: any[];
}
