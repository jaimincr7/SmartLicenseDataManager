import { IMenu } from '../../../../services/administration/menu/menu.model';

export interface IEditMenuModal {
  selectedMenu: IMenu;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  parentMenu: any[];
}
