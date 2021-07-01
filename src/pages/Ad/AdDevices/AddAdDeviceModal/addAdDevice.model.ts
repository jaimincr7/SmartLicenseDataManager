export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddAdDeviceProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
