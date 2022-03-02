export interface IAddWindowsServerLicenseProps {
  id: number;
  showModal: boolean;
  isMultiple?: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  valuesForSelection?: any[];
  filterKeys?: any;
  tableName?: string;
}
