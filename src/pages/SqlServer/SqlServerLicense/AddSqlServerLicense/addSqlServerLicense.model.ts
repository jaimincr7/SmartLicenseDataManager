export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddSqlServerLicenseProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
