export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddAdDevicesExclusionsProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
