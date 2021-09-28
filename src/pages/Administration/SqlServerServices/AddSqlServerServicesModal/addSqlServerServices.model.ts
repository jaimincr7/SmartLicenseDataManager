export interface IAddConfigSqlServerServicesProps {
  id: number;
  showModal: boolean;
  isMultiple?: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  valuesForSelection?: any[];
}
