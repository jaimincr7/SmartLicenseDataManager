export interface IDropDownOption {
  id: number;
  name: string;
}

export interface IAddSqlServerPricingProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
