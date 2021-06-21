export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddSqlServerProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
