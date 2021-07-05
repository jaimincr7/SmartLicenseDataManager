export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddWindowsServerInventoryProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
