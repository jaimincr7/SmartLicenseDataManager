export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddAdUsersProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}